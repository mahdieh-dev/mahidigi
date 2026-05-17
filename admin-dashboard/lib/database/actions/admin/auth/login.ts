"use server";

import { cookies } from "next/headers";
import { connectToDatabase } from "./../../../connect";
import User from "@/lib/database/models/user.model";

export const loginAdmin = async ({ email, password }: { email: string, password: string }) => {
    try {
        if (!email || !password) {
            return {
                message: "Please fill in all fields",
                success: false,
            };
        }

        await connectToDatabase();

        const admin = await User.findOne({ email }).select("+password");

        if (!admin) {
            return {
                message: "Invalid email or password",
                success: false,
            };
        }

        // const isPasswordCorrect = await admin.comparePassword(password);

        // if (!isPasswordCorrect) {
        //     return {
        //         message: "Invalid email or password",
        //         success: false,
        //     };
        // }

        if (admin.role !== "admin") {
            return {
                message: "Unauthorized access",
                success: false,
            };
        }

        const token = admin.getJWTToken();

        const cookieStore = await cookies();

        cookieStore.set("admin_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return {
            message: "Login successful",
            success: true,
            admin: JSON.parse(
                JSON.stringify({
                    _id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                    verified: admin.verified,
                })
            ),
        };
    } catch (error: any) {
        console.log(error);

        return {
            message: error.message || "Failed to login admin",
            success: false,
        };
    }
};