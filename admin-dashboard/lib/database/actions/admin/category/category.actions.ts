"use server"

import { connectToDatabase } from "@/lib/database/connect"
import Category from "@/lib/database/models/category.model"
import slugify from "slugify"
import cloudinary from "cloudinary"
import { base64ToBuffer } from "@/utils"
import mongoose from "mongoose"
const { ObjectId } = mongoose.Types

// config out cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

// create a category for admin:
export const createCategory = async (name: string, images: string[]) => {
    try {
        await connectToDatabase()

        const test = await Category.findOne({ name })

        if (test) {
            return {
                message: "Category already exists, try a different name.",
                success: false,
                categories: [],
            }
        }

        const uploadImagesToCloudinary = images.map(async (base64Image: string) => {
            const buffer = base64ToBuffer(base64Image)

            const formData = new FormData()
            formData.append("file", new Blob([buffer], { type: "image/jpeg" }))
            formData.append("upload_preset", "website")

            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData,
                }
            )

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data?.error?.message || "Cloudinary upload failed")
            }

            return data
        })

        const cloudinaryImages = await Promise.all(uploadImagesToCloudinary)

        const imageUrls = cloudinaryImages.map((img) => ({
            url: img.secure_url,
            public_id: img.public_id,
        }))

        await new Category({
            name,
            slug: slugify(name),
            images: imageUrls,
            vendor: new ObjectId("6a09dfbd5ba7cf73fec94489")
        }).save()

        const categories = await Category.find().sort({ updatedAt: -1 })

        return {
            success: true,
            message: `Category ${name} has been successfully created.`,
            categories: JSON.parse(JSON.stringify(categories)),
        }
    } catch (error: any) {
        console.log(error)

        return {
            success: false,
            message: error?.message || "Something went wrong while creating category.",
            categories: [],
        }
    }
}

// delete Category for admin:
export const deleteCategory = async (id: string) => {
    try {
        await connectToDatabase()

        const category = await Category.findByIdAndDelete(id)

        if (!category) {
            return {
                message: "Category not found with this ID!",
                success: false,
                categories: [],
            }
        }

        const imagePublicIds = category.images
            ?.map((image: any) => image.public_id)
            .filter(Boolean) || []

        const deleteImagePromises = imagePublicIds.map((publicId: string) =>
            cloudinary.v2.uploader.destroy(publicId)
        )

        await Promise.all(deleteImagePromises)

        const categories = await Category.find().sort({ updatedAt: -1 })

        return {
            success: true,
            message: "Successfully deleted Category and its associated images in Cloudinary.",
            categories: JSON.parse(JSON.stringify(categories)),
        }
    } catch (error: any) {
        console.log(error)

        return {
            success: false,
            message: error?.message || "Something went wrong while deleting category.",
            categories: [],
        }
    }
}

// update category for admin
export const updateCategory = async (id: string, name: string) => {
    try {
        await connectToDatabase()
        const category = await Category.findByIdAndUpdate(id, { name })
        if (!category) {
            return {
                message: "Category not found with this Id!",
                success: false,
            }
        }
        const categories = await Category.find().sort({ updatedAt: -1 })
        return {
            message: "Successfully updated product!",
            success: true,
            categories: JSON.parse(JSON.stringify(categories))
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

// get all categories for admin
export const getAllCategories = async () => {
    try {
        await connectToDatabase()
        const categories = await Category.find().sort({ updatedAt: -1 })
        return JSON.parse(JSON.stringify(categories))
    } catch (error: any) {
        console.log(error)
    }
}