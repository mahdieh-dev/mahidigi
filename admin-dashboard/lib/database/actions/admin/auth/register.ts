"use server";

import bcrypt from "bcrypt";

import { connectToDatabase } from "./../../../connect";
import Vendor from "@/lib/database/models/vendor.model";
import { cookies } from "next/headers";

type RegisterVendorInput = {
    name: string;
    email: string;
    password: string;
    description?: string;
    address: string;
    phoneNumber: number | string;
    zipCode: number | string;
};

export const registerVendor = async ({
    name,
    email,
    password,
    description,
    address,
    phoneNumber,
    zipCode,
}: RegisterVendorInput) => {
    try {
        if (!name || !email || !password || !address || !phoneNumber || !zipCode) {
            return {
                message: "Please fill in all required fields",
                success: false,
            };
        }

        await connectToDatabase();

        const existingVendor = await Vendor.findOne({ email });

        if (existingVendor) {
            return {
                message: "Vendor already exists with this email",
                success: false,
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const vendor = await Vendor.create({
            name,
            email,
            password: hashedPassword,
            description,
            address,
            phoneNumber: Number(phoneNumber),
            zipCode: Number(zipCode),
            verified: false,
        });

        const token = vendor.getJWTToken()
        const cookieStore = await cookies()

        cookieStore.set("vendor_token", token, {
            httpOnly: true,
            sameSite: 'strict',
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 7 * 24 * 60 * 60
        })

        return {
            message: "Vendor registered successfully. Please wait for admin approval.",
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
            message: error.message || "Failed to register vendor",
            success: false,
        };
    }
};