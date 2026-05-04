"use client"

import { Button, Group } from "@mantine/core"
import { useRouter } from "next/navigation"
import { logoutVendor } from "@/lib/database/actions/vendor/auth/logout"
import React, { useEffect, useState } from "react"
import { getVendorCookiesAndFetchVendor } from "@/lib/database/actions/vendor/vendor.actions"
import Logo from "./logo"

const Navbar = () => {
    const [vendor, setVendor] = useState(null)
    const [message, setMessage] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                await getVendorCookiesAndFetchVendor().then(res => {
                    setVendor(res.vendor)
                    setMessage(res.message)
                })
            } catch (error: any) {
                console.log(error)
            }
        }

        fetchVendorDetails()
    }, [])

    return (
        <header className="p-4 border-b border-b-[#eaeaea]">
            <nav className="flex justify-between items-center">
                <Logo />
                <Group>
                    {vendor && vendor.name ? (
                        <div className="flex gap-2.5">
                            <Button variant="outline"
                                onClick={() => router.push("/vendor/dashboard")}>
                                Vendor Dashboard
                            </Button>
                            <Button onClick={() => {
                                logoutVendor()
                                router.refresh();
                            }}></Button>
                        </div>
                    ) : (
                        <div className="flex gap-2.5">
                            <Button variant="outline" onClick={() => router.push("/signin")}>
                                Sign In
                            </Button>
                            <Button onClick={() => router.push("signup")}>
                                Sign Up
                            </Button>
                        </div>
                    )}
                </Group>
            </nav>
        </header>
    )
}

export default Navbar