"use server"

import { connectToDatabase } from '@/lib/database/connect';
import Category from '@/lib/database/models/category.model';
import Product from '@/lib/database/models/product.model';
import Vendor from '@/lib/database/models/vendor.model';
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

// creation of a product for vendor
export const createProduct = async (
    {
        vendorId,
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
        parent
    }
        :
        {
            vendorId: string,
            sku: string,
            color: any,
            images: [],
            sizes: Array<{ size: string, qty: string, price: string }>,
            discount: number,
            name: string,
            description: string,
            longDescription: string,
            brand: string,
            details: Array<{ name: string, value: string }>,
            questions: Array<{ question: string, answer: string }>,
            category: string,
            subCategories: string[],
            benefits: Array<{ name: string }>,
            ingredients: Array<{ name: string }>,
            parent?: string
        }
) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)

        const vendor = await Vendor.findById(vendorObjectId)
        if (!vendor) {
            return {
                message: "Vendor not found",
                success: false
            }
        }

        if (parent) {
            const Parent: any = await Product.findById(parent)
            if (!Parent) {
                return {
                    message: "Parent not found",
                    success: false
                }
            } else {
                await Parent.updateOne({
                    $push: {
                        subProducts: {
                            sku,
                            color,
                            images,
                            sizes,
                            discount,
                        }
                    }
                }, { new: true })
            }
            return {
                message: "Product created successfully.",
                success: true
            }
        } else {
            const slug = slugify(name)
            const newProduct = new Product({
                name, description, longDescription, brand, vendor, details, questions, slug, category, benefits, ingredients, subCategories, subProducts: [
                    {
                        sku, color, images, sizes, discount
                    }
                ]
            })
            await newProduct.save()
            return {
                message: "Product created successfully.",
                success: true
            }
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

//  delete single product for vendor
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

// update single product for vendor

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
    vendorId: string,
    input: UpdateProductInput
) => {
    try {
        await connectToDatabase();

        if (!ObjectId.isValid(productId)) {
            return {
                message: "Invalid product id",
                success: false,
            };
        }

        if (!ObjectId.isValid(vendorId)) {
            return {
                message: "Invalid vendor id",
                success: false,
            };
        }

        const product = await Product.findOne({
            _id: productId,
            "vendor._id": new ObjectId(vendorId),
        });

        if (!product) {
            return {
                message: "Product not found or you don't have permission to edit this product",
                success: false,
            };
        }

        const subProduct = product.subProducts?.[0];

        if (!subProduct) {
            return {
                message: "Sub product not found",
                success: false,
            };
        }

        if (!subProduct.color) {
            subProduct.color = {};
        }

        const normalizedSizes = input.sizes.map((item) => {
            const existingSize = subProduct.sizes.find(
                (size: any) => size.size === item.size
            );

            return {
                size: item.size,
                qty: Number(item.qty),
                price: Number(item.price),
                sold: existingSize?.sold ?? 0,
            };
        });

        product.name = input.name;
        product.description = input.description;
        product.longDescription = input.longDescription;
        product.brand = input.brand;
        product.details = input.details;
        product.benefits = input.benefits;
        product.ingredients = input.ingredients;

        subProduct.sku = input.sku;
        subProduct.color.color = input.color;
        subProduct.sizes = normalizedSizes;
        subProduct.discount = input.discount;

        await product.save();

        return {
            message: "Product updated successfully",
            success: true,
            product: JSON.parse(JSON.stringify(product))
        };
    } catch (error: any) {
        console.log(error);

        return {
            message: error.message || "Failed to update product",
            success: false,
        };
    }
};

// get single product by ID for vendor
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

// get variant products for vendor
export const getVendorProducts = async (vendorId: string) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)

        const products = await Product.find({ "vendor._id": vendorObjectId }).sort({ updatedAt: -1 }).populate({ path: "category", model: Category }).lean()

        return JSON.parse(JSON.stringify(products))
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
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