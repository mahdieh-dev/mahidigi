"use server"

import Order from "@/lib/database/models/order.model"
import { generateLast12MonthData } from "./analytics.generator"
import Product from "@/lib/database/models/product.model"
import { connectToDatabase } from "@/lib/database/connect"
import { verify_vendor } from "@/utils"

// get Order analytics from vendor
export const getOrderAnalytics = async () => {
    try {
        const orders = await generateLast12MonthData(Order, "order")
        return { orders }
    } catch (error: any) {
        console.log(error)
    }
}

// get Product analytics from vendor
export const getProductAnalytics = async () => {
    try {
        const products = await generateLast12MonthData(Product, "product")
        return { products }
    } catch (error: any) {
        console.log(error)
    }
}

// get product size analytics for vendor
export const sizeAnalytics = async () => {
    try {
        await connectToDatabase()
        const vendorObjectId = await verify_vendor()
        const products = await Product.find({ "vendor._id": vendorObjectId })
        if (!products) {
            return {
                message: "Vendor Id is invalid!",
                success: false
            }
        }

        const individualSizeAnalytics = products.reduce((acc, product) => {
            product.subProducts.forEach((subProduct: any) => {
                subProduct.sizes.forEach((size: any) => {
                    if (acc[size.size]) {
                        acc[size.size] += size.sold;
                    } else {
                        acc[size.size] = size.sold;
                    }
                })
            });
            return acc;
        })

        const sizeData = Object.keys(individualSizeAnalytics).map((size) => ({
            name: size,
            value: individualSizeAnalytics[size]
        }))
        return JSON.parse(JSON.stringify(sizeData))
    } catch (error: any) {
        console.log(error)
    }
}