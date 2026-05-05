"use server";

import { cookies } from "next/headers";
import { connectToDatabase } from "./../../../connect";
import Vendor from "@/lib/database/models/vendor.model";

export const loginVendor = async ({ email, password }: { email: string, password: string }) => {
    try {
        if (!email || !password) {
            return {
                message: "Please fill in all fields",
                success: false,
            };
        }

        await connectToDatabase();

        const vendor = await Vendor.findOne({ email }).select("+password");

        if (!vendor) {
            return {
                message: "Invalid email or password",
                success: false,
            };
        }

        const isPasswordCorrect = await vendor.comparePassword(password);

        if (!isPasswordCorrect) {
            return {
                message: "Invalid email or password",
                success: false,
            };
        }

        const token = vendor.getJWTToken();

        const cookieStore = await cookies();

        cookieStore.set("vendor_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return {
            message: "Login successful",
            success: true,
            vendor: JSON.parse(
                JSON.stringify({
                    _id: vendor._id,
                    name: vendor.name,
                    email: vendor.email,
                    role: vendor.role,
                    verified: vendor.verified,
                })
            ),
        };
    } catch (error: any) {
        console.log(error);

        return {
            message: error.message || "Failed to login vendor",
            success: false,
        };
    }
};