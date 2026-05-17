"use server"

import { connectToDatabase } from '@/lib/database/connect'
import Offer from '@/lib/database/models/offer.model'
import { base64ToBuffer } from '@/utils'
import cloudinary from 'cloudinary'

// config out cloudinary
cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
})

// create offer for admin
export const createOffer = async ({ title, offerType, images }: { title: string, offerType: string, images: string[] }) => {
    try {
        if (!title) {
            return {
                success: false,
                message: "Please provide a title for the offer"
            }
        }
        await connectToDatabase()
        const test = await Offer.findOne({ title })
        if (test) {
            return {
                message: "Offer with this title already exists!",
                success: false
            }
        }

        const uploadImagesToCloudinary = images.map(async (base64Image: any) => {
            const buffer = base64ToBuffer(base64Image)
            const formData = new FormData()
            formData.append("file", new Blob([buffer], { type: "image/jpeg" }))
            formData.append("upload_preset", "website")
            const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUNDINARY_NAME}/image/upload`, {
                method: "POST",
                body: formData
            })

            return response.json()
        })

        const uploadImages = await Promise.all(uploadImagesToCloudinary)
        const imageUrls = uploadImages.map(img => ({
            url: img.secure_url,
            public_id: img.public_id
        }))

        await new Offer({
            title, offerType, images: imageUrls
        }).save()

        const offers = await Offer.find().sort({ updatedAt: -1 })

        return {
            message: `Offer ${title} has been successfully created.`,
            success: true,
            offers: JSON.parse(JSON.stringify(offers))
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

// delete an offer and its associated images from cloudinary for admin
export const deleteOffer = async (offerId: string) => {
    try {
        await connectToDatabase()

        const offer = await Offer.findById(offerId)

        if (!offer) {
            return {
                success: false,
                message: "No offers found with this ID"
            }
        }

        const deleteImagePromises = offer.images.map((image: any) => (image.public_id ? cloudinary.v2.uploader.destroy(image.public_id) : {}))
        await Promise.all(deleteImagePromises)
        await Offer.findByIdAndDelete(offerId)

        const offers = await Offer.find().sort({ updatedAt: -1 }).lean()

        return {
            success: true,
            offers: JSON.parse(JSON.stringify(offers)),
            message: "Successfully deleted the offer and its images"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

// get all offers for admin
export const getAllOffers = async () => {
    try {
        await connectToDatabase()
        const offers = await Offer.find().sort({ updatedAt: -1 }).lean()
        if (!offers) {
            return {
                success: false,
                message: "No offers found"
            }
        }
        return {
            success: true,
            offers: JSON.parse(JSON.stringify(offers))
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

// update offer for admin
export const updateOffer = async (offerId: string, { title, offerType, images }: { title: string, offerType: string }) => {
    try {
        await connectToDatabase()
        const offer = await Offer.findById(offerId)
        if (!offer) {
            return {
                message: "No offers found with this ID",
                success: false
            }
        }

        offer.title = title
        offer.offerType = offerType
        offer.save()

        const offers = await Offer.find().sort({ updatedAt: -1 })

        return {
            message: "Offer has been successfully updated.",
            success: true,
            offers: JSON.parse(JSON.stringify(offers))
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}