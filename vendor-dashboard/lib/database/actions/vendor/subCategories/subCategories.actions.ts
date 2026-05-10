"use server"

import { connectToDatabase } from '@/lib/database/connect';
import Category from '@/lib/database/models/category.model';
import SubCategory from '@/lib/database/models/subcategory.model';
import { base64ToBuffer } from '@/utils';
import cloudinary from 'cloudinary';
import mongoose from 'mongoose';
import slugify from 'slugify'

// config cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

// get all subcategories and categories for vendor
export const getAllSubCategoriesAndCategories = async () => {
    try {
        await connectToDatabase()

        const categories = await Category.find().sort({ updatedAt: -1 }).lean()
        const subCategories = await SubCategory.find().populate({ path: "parent", model: Category }).sort({ updatedAt: -1 }).lean()

        return {
            success: true,
            categories: JSON.parse(JSON.stringify(categories)),
            subCategories: JSON.parse(JSON.stringify(subCategories)),
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// get single subCategory for vendor
export const getSingleSubCategory = async (category?: string) => {
    try {
        if (!Category) {
            return {
                message: "No categories provided",
                subCategories: [],
                success: false
            }
        }

        await connectToDatabase()

        const subCategory = await SubCategory.find({ parent: category }).select("name")

        return subCategory
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// create subCategory for vendor
export const createSubCategory = async (name: string, parent: string, images: any[]) => {
    try {
        await connectToDatabase()

        const test = await SubCategory.findOne({ name })
        if (test) {
            return {
                success: false,
                message: "SubCategory already exists, try a different name."
            }
        }

        const uploadImagesToCloudinary = images.map(async (base64Image: any) => {
            const buffer = base64ToBuffer(base64Image)

            const formData = new FormData()
            formData.append("file", new Blob([buffer], { type: "image/jpeg" }))
            formData.append("upload_preset", "website")

            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData
                })

            return response.json()
        })

        const cloudinaryImages = await Promise.all(uploadImagesToCloudinary)
        const imageUrls = cloudinaryImages.map((img) => ({
            url: img.secret_url,
            public_id: img.public_id,
        }))

        await new SubCategory({
            name,
            parent,
            slug: slugify(name),
            images: imageUrls
        }).save()
        const subCategories = await SubCategory.find().sort({ updatedAt: -1 })

        return {
            success: true,
            message: `SubCategory ${name} has been successfully created.`,
            subCategories: JSON.parse(JSON.stringify(subCategories))
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error.message || "Failed to create subCategory",
            success: false
        }
    }
}

// delete subCategory for vendor
export const deleteSubCategory = async (id: string) => {
    try {
        await connectToDatabase()

        const subCategory = await SubCategory.findByIdAndDelete(id)

        if (!subCategory) {
            return {
                message: "SubCategory not found",
                success: false
            }
        }

        const imagePublicIds = subCategory.images.map((image: any) => image.public_id)
        const deleteImagePromises = imagePublicIds.map((publicId: string) => cloudinary.v2.uploader.destroy(publicId))
        await Promise.all(deleteImagePromises)

        const subCategories = await SubCategory.find().sort({ updatedAt: -1 })

        return {
            message: "SubCategory was successfully deleted",
            success: true,
            subCategories: JSON.parse(JSON.stringify(subCategories))
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// update subCategory for vendor
export const updateSubCategory = async (id: string, name: string, parent: string | null) => {
    try {
        await connectToDatabase()

        const updatedParent: mongoose.Types.ObjectId | null = parent && mongoose.Types.ObjectId.isValid(parent) ? new mongoose.Types.ObjectId(parent) : null
        const slug = slugify(name)
        
        await SubCategory.findByIdAndUpdate(id, { name, parent: updatedParent, slug })
        const subCategories = await SubCategory.find().sort({ updatedAt: -1 })

        return {
            message: "SubCategory successfully uploaded.",
            subCategories: JSON.parse(JSON.stringify(subCategories)),
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

// get subCategories by category parent for vendor
export const getSubCategoriesByCategoryParent = async (category: string) => {
    try {
        if (!category) {
            return {
                message: "No category was provided",
                subCategories: [],
                success: false
            }
        }

        await connectToDatabase()

        const subCategories = await SubCategory.find({ parent: category }).select("name")

        return {
            success: true,
            subCategories: JSON.parse(JSON.stringify(subCategories))
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}