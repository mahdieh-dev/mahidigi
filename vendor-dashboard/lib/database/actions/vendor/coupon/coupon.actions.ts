"use server"

import { connectToDatabase } from "@/lib/database/connect"
import Coupon from "@/lib/database/models/coupon.model"
import Vendor from "@/lib/database/models/vendor.model"
import mongoose from "mongoose"
const { ObjectId } = mongoose.Types

// create a coupon for vendor
export const createCoupon = async (coupon: string, discount: number, startDate: any, endDate: any, vendorId: string) => {
    try {
        await connectToDatabase()
        const vendor = await Vendor.findById(vendorId)
        if (!vendor) {
            return {
                message: "Vendor Id is invalid!",
                success: false,
            }
        }
        const test = await Coupon.findOne({ coupon })
        if (test) {
            return {
                success: false,
                message: "Coupon already exists, try a different coupon name."
            }
        }
        await new Coupon({
            coupon, discount, startDate, endDate, vendor
        }).save()

        const vendorCoupons = await Coupon.find({
            "vendor._id": new ObjectId(vendorId),
        }).sort({
            updatedAt: -1
        })

        return {
            success: true,
            message: `Coupon ${coupon} has been successfully created.`,
            coupons: JSON.parse(JSON.stringify(vendorCoupons))
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

// delete coupon for vendor
export const deleteCoupon = async (couponId: string, vendorId: string) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)

        const coupon = await Coupon.findByIdAndDelete(couponId)
        if (!coupon) {
            return {
                message: "No coupon found with this Id!",
                success: false
            }
        }

        const vendor = await Vendor.findById(vendorObjectId)
        if (!vendor) {
            return {
                message: "Vendor Id is invalid!",
                success: false
            }
        }

        const vendorCoupons = await Coupon.find({
            "vendor._id": vendorObjectId
        }).sort({ updatedAt: -1 })

        return {
            message: "Successfully deleted!",
            coupons: JSON.parse(JSON.stringify(vendorCoupons)),
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

// update coupon for vendor
export const updateCoupon = async (couponId: string, coupon: string, discount: number, startDate: any, endDate: any, vendorId: string) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)

        const foundCoupon = await Coupon.findByIdAndUpdate(couponId, {
            coupon, discount, startDate, endDate,
        })

        if (!foundCoupon) {
            return {
                message: "No Coupon found with this Id.",
                success: false
            }
        }

        const vendorCoupons = await Coupon.find({ "vendor._id": vendorObjectId }).sort({ updatedAt: -1 })
        return {
            message: "Successfully updated!",
            coupons: JSON.parse(JSON.stringify(vendorCoupons)),
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

// get all coupons for vendor
export const getAllCoupons = async (vendorId: string) => {
    try {
        await connectToDatabase()
        const vendorObjectId = new ObjectId(vendorId)
        const coupons = await Coupon.find({ "vendor._id": vendorObjectId }).sort({ updatedAt: -1 }).lean()

        if (!coupons || !coupons.length) {
            return {
                message: "No vendor or created vendor coupon found with this Id!",
                success: false
            }
        }

        return {
            message: "Successfully fetched vendor coupons",
            coupons: JSON.parse(JSON.stringify(coupons)),
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