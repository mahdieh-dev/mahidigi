"use server"

import { connectToDatabase } from "@/lib/database/connect"
import Coupon from "@/lib/database/models/coupon.model"
import mongoose from "mongoose"
const { ObjectId } = mongoose.Types

// create a coupon for admin
export const createCoupon = async (coupon: string, discount: number, startDate: any, endDate: any) => {
    try {
        await connectToDatabase()
        const test = await Coupon.findOne({ coupon })
        if (test) {
            return {
                success: false,
                message: "Coupon already exists, try a different coupon name."
            }
        }
        await new Coupon({
            coupon, discount, startDate, endDate, vendor: new ObjectId("6a09dfbd5ba7cf73fec94489")
        }).save()

        const coupons = await Coupon.find().sort({
            updatedAt: -1
        })

        return {
            success: true,
            message: `Coupon ${coupon} has been successfully created.`,
            coupons: JSON.parse(JSON.stringify(coupons))
        }
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

// delete coupon for admin
export const deleteCoupon = async (couponId: string) => {
    try {
        await connectToDatabase()

        const coupon = await Coupon.findByIdAndDelete(couponId)
        if (!coupon) {
            return {
                message: "No coupon found with this Id!",
                success: false
            }
        }

        const coupons = await Coupon.find().sort({ updatedAt: -1 })

        return {
            message: "Successfully deleted!",
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

// update coupon for admin
export const updateCoupon = async (couponId: string, coupon: string, discount: number, startDate: any, endDate: any) => {
    try {
        await connectToDatabase()

        const foundCoupon = await Coupon.findByIdAndUpdate(couponId, {
            coupon, discount, startDate, endDate,
        })

        if (!foundCoupon) {
            return {
                message: "No Coupon found with this Id.",
                success: false
            }
        }

        const coupons = await Coupon.find().sort({ updatedAt: -1 })
        return {
            message: "Successfully updated!",
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

// get all coupons for admin
export const getAllCoupons = async () => {
    try {
        await connectToDatabase()
        const coupons = await Coupon.find().sort({ updatedAt: -1 }).lean()

        if (!coupons || !coupons.length) {
            return {
                message: "No coupons found!",
                success: false
            }
        }

        return {
            message: "Successfully fetched coupons",
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