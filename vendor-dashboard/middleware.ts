import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl
    const vendor_token = req.cookies.get("vendor_token")

    // unauthorized vendor cannot go to the starting /vendor route
    if (pathname.startsWith("/vendor") || pathname.startsWith("/vendor/shop")) {
        if (typeof vendor_token === "undefined") {
            return NextResponse.json({
                message: "Please login to continue"
            }, { status: 401 })
        }
    }

    if (pathname === "/signin" || pathname === "/signup") {
        if (vendor_token) {
            return NextResponse.json({
                message: "You are already logged in. Just go to dashboard."
            }, { status: 401 })
        }
    }

}