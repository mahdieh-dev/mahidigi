"use server"

import Order from "@/lib/database/models/order.model"
import { generateLast12MonthData } from "./analytics.generator"
import Product from "@/lib/database/models/product.model"
import { connectToDatabase } from "@/lib/database/connect"
import User from "@/lib/database/models/user.model"

// get  users analytics for admin - only admins can access this
export const getUserAnalytics = async () => {
    try {
        const users = await generateLast12MonthData(User)
        return { users }
    } catch (error) {
        console.log(error)
    }
}

// get Order analytics from admin
export const getOrderAnalytics = async () => {
    try {
        const orders = await generateLast12MonthData(Order)
        return { orders }
    } catch (error: any) {
        console.log(error)
    }
}

// get Product analytics from admin
export const getProductAnalytics = async () => {
    try {
        const products = await generateLast12MonthData(Product)
        return { products }
    } catch (error: any) {
        console.log(error)
    }
}

// get product size analytics for admin
export const sizeAnalytics = async () => {
    try {
        await connectToDatabase()
        const products = await Product.find()
        if (!products) {
            return {
                message: "No products found.",
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

// get top selling products for admin
export const getTopSellingProducts = async () => {
    try {
        await connectToDatabase()

        let topSellingProducts = await Product.find().sort({ "subProducts.sold": -1 }).limit(5).lean()
        const pieChartData = topSellingProducts.map(product => ({
            name: product.name,
            value: product.subProducts[0].sold,
        }))
        return JSON.parse(JSON.stringify(pieChartData))
    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}