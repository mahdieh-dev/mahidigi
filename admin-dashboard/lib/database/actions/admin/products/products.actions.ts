"use server"

import { connectToDatabase } from '@/lib/database/connect';
import Category from '@/lib/database/models/category.model';
import Product from '@/lib/database/models/product.model';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types
import slugify from 'slugify';

// config Cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

// creation of a product for admin
export const createProduct = async ({
    sku,
    color,
    images,
    sizes,
    discount,
    name,
    description,
    longDescription,
    brand,
    details,
    questions,
    category,
    subCategories,
    benefits,
    ingredients,
    parent,
}: {
    sku: string
    color: {
        color: string
        image: string
    }
    images: Array<{
        url: string
        public_id: string
    }>
    sizes: Array<{
        size: string
        qty: string | number
        price: string | number
    }>
    discount: number
    name: string
    description: string
    longDescription: string
    brand: string
    details: Array<{ name: string; value: string }>
    questions: Array<{ question: string; answer: string }>
    category: string
    subCategories: string[]
    benefits: Array<{ name: string }>
    ingredients: Array<{ name: string }>
    parent?: string
}) => {
    try {
        await connectToDatabase()

        if (!ObjectId.isValid(category)) {
            return {
                success: false,
                message: "Invalid category id.",
            }
        }

        if (
            !Array.isArray(images) ||
            images.length === 0 ||
            images.some((img) => !img?.url || !img?.public_id)
        ) {
            return {
                success: false,
                message: "Invalid product images.",
            }
        }

        if (!Array.isArray(sizes) || sizes.length === 0) {
            return {
                success: false,
                message: "At least one size is required.",
            }
        }

        const normalizedSizes = sizes.map((size) => ({
            size: String(size.size),
            qty: Number(size.qty),
            price: Number(size.price),
            sold: 0,
        }))

        const normalizedSubCategories = Array.isArray(subCategories)
            ? subCategories.filter(Boolean).map((id) => new ObjectId(id))
            : []

        const subProductPayload = {
            sku,
            color,
            images,
            sizes: normalizedSizes,
            discount: Number(discount) || 0,
        }

        if (parent) {
            if (!ObjectId.isValid(parent)) {
                return {
                    success: false,
                    message: "Invalid parent product id.",
                }
            }

            const updatedParent = await Product.findOneAndUpdate(
                {
                    _id: parent,
                },
                {
                    $push: {
                        subProducts: subProductPayload,
                    },
                },
                {
                    new: true,
                    runValidators: true,
                }
            ).lean()

            if (!updatedParent) {
                return {
                    success: false,
                    message: "Parent not found or you don't have permission to update it.",
                }
            }

            return {
                success: true,
                message: "Product variant created successfully.",
                product: JSON.parse(JSON.stringify(updatedParent)),
            }
        }

        const slug = slugify(name, { lower: false })

        const newProduct = await Product.create({
            name,
            description,
            longDescription,
            brand,
            details,
            questions,
            slug,
            category: new ObjectId(category),
            benefits,
            ingredients,
            subCategories: normalizedSubCategories,
            subProducts: [subProductPayload],
            vendor: new ObjectId("6a09dfbd5ba7cf73fec94489")
        })

        return {
            success: true,
            message: "Product created successfully.",
            product: JSON.parse(JSON.stringify(newProduct)),
        }
    } catch (error: any) {
        console.log(error)

        return {
            success: false,
            message: error?.message || "Failed to create product.",
        }
    }
}

//  delete single product for admin
export const deleteProduct = async (productId: string) => {
    try {
        await connectToDatabase()
        const product = await Product.findByIdAndDelete(productId)
        if (!product) {
            return {
                message: "Product not found with this Id!",
                success: false
            }
        }

        return {
            message: "Product successfully deleted!",
            success: true
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// update single product for admin

type UpdateProductInput = {
    sku: string;
    color: string;
    sizes: Array<{
        size: string;
        qty: number | string;
        price: number | string;
    }>;
    discount: number;
    name: string;
    description: string;
    brand: string;
    details: Array<{
        name: string;
        value: string;
    }>;
    questions?: Array<{
        question: string;
        answer: string;
    }>;
    benefits: Array<{
        name: string;
    }>;
    ingredients: Array<{
        name: string;
    }>;
    longDescription: string;
};

export const updateProduct = async (
    productId: string,
    input: UpdateProductInput
) => {
    try {
        await connectToDatabase()

        if (!ObjectId.isValid(productId)) {
            return {
                message: "Invalid product id",
                success: false,
            }
        }

        const product = await Product.findOne({
            _id: productId,
        })

        if (!product) {
            return {
                message:
                    "Product not found or you don't have permission to edit this product",
                success: false,
            }
        }

        const subProduct = product.subProducts?.[0]

        if (!subProduct) {
            return {
                message: "Sub product not found",
                success: false,
            }
        }

        if (!subProduct.color) {
            subProduct.color = {}
        }

        const normalizedSizes = Array.isArray(input.sizes)
            ? input.sizes
                .filter(item => item.size?.trim())
                .map(item => {
                    const existingSize = subProduct.sizes.find(
                        (size: any) => size.size === item.size
                    )

                    return {
                        size: item.size.trim(),
                        qty: Number(item.qty) || 0,
                        price: Number(item.price) || 0,
                        sold: existingSize?.sold ?? 0,
                    }
                })
            : []

        const normalizedDetails = Array.isArray(input.details)
            ? input.details
                .filter(item => item.name?.trim() || item.value?.trim())
                .map(item => ({
                    name: item.name?.trim() || "",
                    value: item.value?.trim() || "",
                }))
            : []

        const normalizedBenefits = Array.isArray(input.benefits)
            ? input.benefits
                .filter(item => item.name?.trim())
                .map(item => ({
                    name: item.name.trim(),
                }))
            : []

        const normalizedIngredients = Array.isArray(input.ingredients)
            ? input.ingredients
                .filter(item => item.name?.trim())
                .map(item => ({
                    name: item.name.trim(),
                }))
            : []

        const normalizedQuestions = Array.isArray(input.questions)
            ? input.questions
                .filter(item => item.question?.trim() || item.answer?.trim())
                .map(item => ({
                    question: item.question?.trim() || "",
                    answer: item.answer?.trim() || "",
                }))
            : []

        if (normalizedSizes.length === 0) {
            return {
                message: "At least one size is required",
                success: false,
            }
        }

        product.name = input.name
        product.description = input.description
        product.longDescription = input.longDescription
        product.brand = input.brand
        product.details = normalizedDetails
        product.benefits = normalizedBenefits
        product.ingredients = normalizedIngredients
        product.questions = normalizedQuestions

        subProduct.sku = input.sku
        subProduct.color.color = input.color
        subProduct.sizes = normalizedSizes
        subProduct.discount = Number(input.discount) || 0

        await product.save()

        return {
            message: "Product updated successfully",
            success: true,
            product: JSON.parse(JSON.stringify(product)),
        }
    } catch (error: any) {
        console.log(error)

        return {
            message: error.message || "Failed to update product",
            success: false,
        }
    }
}

// get single product by ID for admin
export const getSingleProductById = async (
    id: string,
    style: number = 0,
    size: number = 0
) => {
    try {
        await connectToDatabase();

        const product = await Product.findById(id);

        if (!product) {
            return {
                success: false,
                message: "Product not found",
            };
        }

        const subProduct = product.subProducts?.[style];

        if (!subProduct) {
            return {
                success: false,
                message: "Product style not found",
            };
        }

        const selectedSize = subProduct.sizes?.[size];

        if (!selectedSize) {
            return {
                success: false,
                message: "Product size not found",
            };
        }

        const discount = subProduct.discount || 0;
        const priceBefore = selectedSize.price;

        const price = discount
            ? priceBefore - (priceBefore * discount) / 100
            : priceBefore;

        const serializedProduct = JSON.parse(JSON.stringify(product));

        return {
            success: true,
            product: serializedProduct,
            selectedVariant: {
                style,
                size,
                discount,
                priceBefore,
                price,
            },
        };
    } catch (error: any) {
        console.log(error);

        return {
            success: false,
            message: error.message || "Failed to get product",
        };
    }
};

// get variant products for admin
export const getAllProducts = async () => {
    try {
        await connectToDatabase()

        const products = await Product.find()
            .sort({ updatedAt: -1 })
            .populate({ path: "category", model: Category })
            .populate({ path: "vendor", model: "Vendor" })
            .lean()

        return JSON.parse(JSON.stringify(products))
    } catch (error: any) {
        console.log(error)

        return {
            message: error?.message || "Failed to fetch products.",
            success: false,
        }
    }
}

//  get product by id
export const getEntireProductById = async (id: string) => {
    try {
        const product = await Product.findById(id)
        if (!product) {
            return {
                message: "Product not found with this Id",
                success: false,
            }
        }

        return {
            product: JSON.parse(JSON.stringify(product)),
            success: true
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// get parents and categories
export const getParentsAndCategories = async () => {
    try {
        await connectToDatabase()

        const results = await Product.find().select("name subProducts").lean()
        const categories = await Category.find().lean()
        return {
            success: true,
            parents: JSON.parse(JSON.stringify(results)),
            categories: JSON.parse(JSON.stringify(categories))
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// get latest reviews
export const getLatestProductReviews = async () => {
    try {
        await connectToDatabase()

        const reviews = await Product.aggregate([
            { $unwind: "$reviews" },
            {
                $lookup: {
                    from: "users",
                    localField: "reviews.reviewedBy",
                    foreignField: "_id",
                    as: "reviewByDetails"
                }
            },
            {
                $project: {
                    productId: "$_id",
                    productName: "$name",
                    productImage: { $arrayElemAt: ["$subProducts.images", 0] },
                    productDescription: "$description",
                    review: {
                        rating: "$reviews.rating",
                        review: "$reviews.review",
                        reviewCreatedAt: "$reviews.reviewCreatedAt",
                        verified: "$reviews.verified",
                        _id: "$reviews._id",
                        reviewBy: { $arrayElemAt: ["$reviewByDetails", 0] }
                    }
                }
            },
            { $sort: { "review.reviewCreatedAt": -1 } }
        ])

        return JSON.parse(JSON.stringify(reviews))
    } catch (error) {
        console.log(error)
    }
}

// switch product review to verified
export const handleVerificationChange = async (id: string, value: boolean) => {
    try {
        await connectToDatabase()
        const product = await Product.findOneAndUpdate({ "reviews._id": id }, { $set: { "reviews.$.verified": value } }, { new: true })

        if (!product) {
            return {
                success: false,
                message: "Review not found"
            }
        }

        return { message: "Successfully updated review", success: true }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}