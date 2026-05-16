"use server"

import { verify_vendor } from "@/utils"
import Vendor from "../../models/vendor.model"
import { connectToDatabase } from "../../connect"
import mongoose from "mongoose"
import { cookies } from "next/headers"
const { ObjectId } = mongoose.Types


// get vendor cookies for vendor
export const getVendorCookiesAndFetchVendor = async () => {
    try {
        const vendorObjectId = await verify_vendor()

        await connectToDatabase()

        const vendor = await Vendor.findById(vendorObjectId)
        if (!vendorObjectId) {
            const cookieStore = await cookies()
            cookieStore.delete("vendor_token")
            return {
                message: "Vendor does not exist",
                success: false,
                vendor: []
            }
        }

        return {
            success: true,
            vendor: JSON.parse(JSON.stringify(vendor))
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// get single vendor for vendor
export const getSingleVendor = async (vendorId: string) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)

        const vendor = await Vendor.findById(vendorObjectId)
        if (!vendor) {
            return {
                message: "Vendor does not exist",
                success: false
            }
        }

        return {
            success: true,
            vendor: JSON.parse(JSON.stringify(vendor))
        }
    } catch (error: any) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// check vendor for vendor
export const checkVendor = async (vendorId: string) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)

        const vendor = await Vendor.findById(vendorObjectId)
        if (!vendor) {
            return {
                message: "Vendor not found.",
                success: false
            }
        }

        return {
            message: "Vendor found",
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

// check vendor if he was verified by an admin for vendor
export const checkVendorVerified = async (vendorId: string) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)

        const vendor = await Vendor.findById(vendorObjectId)
        if (!vendor) {
            return {
                message: "Vendor not found",
                success: false,
            }
        }

        const isVerified = vendor.verified
        if (isVerified) {
            return {
                success: true,
                message: "Vendor was verified."
            }
        } else {
            return {
                message: "Vendor was not verified.",
                success: false
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

// get all vendors for admin
export const getAllVendors = async () => {
    try {
        await connectToDatabase()
        const vendors = await Vendor.find().sort({ createdAt: -1 }).lean()
        return JSON.parse(JSON.stringify(vendors))
    } catch (error) {
        console.log(error)
    }
}

// change verify tag for vendor in admin
export async function changeVerifyTagForVendor(vendorId: string, value: boolean) {
    try {
        await connectToDatabase()
        const vendor = await Vendor.findByIdAndUpdate(vendorId, {
            verified: value
        })

        if (!vendor) {
            return {
                success: false,
                message: "Vendor not found with this ID"
            }
        }

        return {
            success: true,
            message: "Successfully updated the vendor verified status"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}