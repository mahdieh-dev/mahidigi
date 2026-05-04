"use server";

import { cookies } from "next/headers";

export const logoutVendor = async () => {
    try {
        const cookieStore = await cookies();

        cookieStore.delete("vendor_token");

        return {
            message: "Logout successful",
            success: true,
        };
    } catch (error: any) {
        console.log(error);

        return {
            message: error.message || "Failed to logout",
            success: false,
        };
    }
};