"use server"

import { connectToDatabase } from "../../connect"
import User from "../../models/user.model"

export async function deleteSingleUser(id: string) {
    try {
        await connectToDatabase()
        const user = await User.findByIdAndDelete(id)
        if (!user) {
            return {
                message: "User not found with this ID",
                success: false
            }
        }

        return {
            message: "Successfully deleted user",
            success: true
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}

export async function getAllUsers() {
    try {
        await connectToDatabase()
        const users = await User.find().sort({ createdAt: -1 }).lean()
        return JSON.parse(JSON.stringify(users))
    } catch (error) {
        console.log(error)
    }
}