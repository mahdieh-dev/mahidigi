"use server"

import { base64ToBuffer } from "@/utils"
import cloudinary from "cloudinary"

// config out cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

// fetch all website banners for admin
export const fetchAllWebsiteBanners = async () => {
    try {
        const result = await cloudinary.v2.api.resources_by_tag("website_banners", {
            type: "upload",
            max_results: 100
        })

        return result.resources
    } catch (error) {
        console.log(error)
    }
}

// upload website banners for admin
export const uploadWebsiteBannerImages = async (images: any) => {
    try {

        const imageUploadPromises = images.map(async (base64Image: any) => {
            const buffer = base64ToBuffer(base64Image)
            const formData = new FormData()
            formData.append("file", new Blob([buffer], { type: "image/jpeg" }))

            // use the upload preset associated with your cloudinary setup
            formData.append("upload_preset", "website")

            // add a tag to categorize images as belonging to "website_banners"
            formData.append("tags", "website_banners")

            // Optionally add a unique identifier for the public_id
            formData.append("public_id", `${Date.now()}`)

            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            })

            return response.json()
        })

        const uploadedImages = await Promise.all(imageUploadPromises)

        const imageUrls = uploadedImages.map(img => ({
            url: img.secure_url,
            public_id: img.public_id,
            tags: img.tags, // retrieve the tags associated with the images
        }))

        return { imageUrls }
    } catch (error) {
        console.log(error)
    }
}

// fetch all app banners for admin
export const fetchAllAppBanners = async () => {
    try {
        const result = await cloudinary.v2.api.resources_by_tag("app_banners", {
            type: "upload",
            max_results: 100
        })

        return result.resources
    } catch (error) {
        console.log(error)
    }
}

// upload website banners for admin
export const uploadAppBannerImages = async (images: any) => {
    try {
        const base64ToBuffer = (base64: any): any => {
            const base64String = base64.split(";base64,").pop()
            return Buffer.from(base64String, "base64")
        }

        const imageUploadPromises = images.map(async (base64Image: any) => {
            const buffer = base64ToBuffer(base64Image)
            const formData = new FormData()
            formData.append("file", new Blob([buffer], { type: "image/jpeg" }))

            // use the upload preset associated with your cloudinary setup
            formData.append("upload_preset", "website")

            // add a tag to categorize images as belonging to "app_banners"
            formData.append("tags", "app_banners")

            // Optionally add a unique identifier for the public_id
            formData.append("public_id", `${Date.now()}`)

            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            })

            return response.json()
        })

        const uploadedImages = await Promise.all(imageUploadPromises)

        const imageUrls = uploadedImages.map(img => ({
            url: img.secure_url,
            public_id: img.public_id,
            tags: img.tags, // retrieve the tags associated with the images
        }))

        return { imageUrls }
    } catch (error) {
        console.log(error)
    }
}

// delete website or app banners
export const deleteAnyBannerById = async (public_id: string) => {
    try {
        const result = await cloudinary.v2.uploader.destroy(public_id)
        if (result.result === "ok") {
            return {
                success: true,
                message: "Successfully deleted images"
            }
        } else {
            return {
                success: false,
                message: result.result
            }
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}