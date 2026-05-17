"use server"

import { connectToDatabase } from "@/lib/database/connect"
import TopBar from "@/lib/database/models/topbar.model"

// create top bar for admin
export const createTopBar = async ({ name, color, btnText, btnColor, btnLink }: { name: string, color: string, btnText: string, btnColor: string, btnLink: string }) => {
    try {
        await connectToDatabase()
        if (!name) {
            return {
                message: "Please provide name.",
                success: false,
            }
        }

        await new TopBar({ title: name, color, "button.title": btnText, "button.color": btnColor, "button.link": btnLink }).save()
        const topBars = await TopBar.find().sort({ updatedAt: -1 })
        return {
            topBars: JSON.parse(JSON.stringify(topBars)),
            success: true,
            message: "Successfully created a new TopBar"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error,
        }
    }
}

// delete top bar for admin
export const deleteTopBar = async (topBarId: string) => {
    try {
        await connectToDatabase()
        const topBar = await TopBar.findByIdAndDelete(topBarId)
        if (!topBar) {
            return {
                success: false,
                message: "No TopBar found with this ID"
            }
        }
        const topBars = await TopBar.find().sort({ updatedAt: -1 })

        return {
            success: true,
            message: "successfully deleted the topBar",
            topBars: JSON.parse(JSON.stringify(topBars))
        }
    } catch (error) {
        console.log(error)
        return {
            message: error,
            success: false
        }
    }
}

// update top bar for admin
export const updateTopBar = async (id: string, { name, color, btnText, btnColor, btnLink }: { name: string, color: string, btnText: string, btnColor: string, btnLink: string }) => {
    try {
        await connectToDatabase()

        const topBar = await TopBar.findByIdAndUpdate(id, { title: name, color, "button.title": btnText, "button.color": btnColor, "button.link": btnLink })
        if (!topBar) {
            return {
                success: false,
                message: "TopBar not found with this ID"
            }
        }

        const topBars = await TopBar.find().sort({ updatedAt: -1 })
        return {
            topBars: JSON.parse(JSON.stringify(topBars)),
            success: true,
            message: "Successfully updated the TopBar"
        }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error,
        }
    }
}

// get all top bars for admin
export const getAllTopBars = async () => {
    try {
        await connectToDatabase()
        const topBars = await TopBar.find().sort({ updatedAt: -1 }).lean()
        if (!topBars) {
            return { success: false, message: "No topBars found" }
        }
        return { topBars: JSON.parse(JSON.stringify(topBars)), success: true }
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: error
        }
    }
}