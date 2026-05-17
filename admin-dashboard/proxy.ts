import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl
    const admin_token = req.cookies.get("admin_token")

    // unauthorized admin cannot go to the starting /admin route
    if (pathname.startsWith("/admin") || pathname.startsWith("/admin/dashboard")) {
        if (typeof admin_token === "undefined") {
            return NextResponse.json({
                message: "Please login to continue"
            }, { status: 401 })
        }
    }

    if (pathname === "/signin") {
        if (admin_token) {
            return NextResponse.json({
                message: "You are already logged in. Just go to dashboard."
            }, { status: 401 })
        }
    }

}