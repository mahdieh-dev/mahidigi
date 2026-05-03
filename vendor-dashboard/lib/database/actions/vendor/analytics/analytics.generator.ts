"use server"

import { verify_vendor } from "@/utils"
import { Document, Model } from "mongoose"

interface MonthData {
    month: string,
    count: number
}

export async function generateLast12MonthData<T extends Document>(
    model: Model<T>,
    type: String,
): Promise<{ last12Months: MonthData[] }> {
    const vendorObjectId = verify_vendor()

    const last12Months: MonthData[] = []
    const currentDate = new Date()
    currentDate.setDate(currentDate.getDate() + 1)
    for (let i = 11; i >= 0; i--) {
        const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1 * 28)
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 28)
        const monthYear = endDate.toLocaleString("default", {
            day: "numeric",
            month: "short",
            year: "numeric"
        })
        if (type === "order") {
            const count = await model.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                },
                "products.vendorId": vendorObjectId
            })
            last12Months.push({ month: monthYear, count })
        }
        if (type === "product") {
            const count = await model.countDocuments({
                createdAt: {
                    $gte: startDate,
                    $lt: endDate
                },
                "vendor._id": vendorObjectId
            })
            last12Months.push({ month: monthYear, count })
        }
    }
}