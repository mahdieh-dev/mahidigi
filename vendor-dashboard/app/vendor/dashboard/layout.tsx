"use client"

import { getVendorCookiesAndFetchVendor } from '@/lib/database/actions/vendor/vendor.actions'
import { AppShell, Burger, Group, MantineProvider } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from "sonner"
import { ModalsProvider } from '@mantine/modals'
import Logo from '@/components/logo'
import Link from 'next/link'
import { MdOutlineCategory, MdSpaceDashboard } from "react-icons/md"
import { RiCoupon3Fill } from 'react-icons/ri'
import { IoIosLogOut } from 'react-icons/io'
import { IoListCircleSharp } from 'react-icons/io5'
import { FaTable } from 'react-icons/fa'
import { BsPatchPlus } from 'react-icons/bs'
import { VscGraph } from 'react-icons/vsc'
import { logoutVendor } from '@/lib/database/actions/vendor/auth/logout'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)
    const [vendor, setVendor] = useState(null)
    const [loading, setLoading] = useState<boolean>(false)
    const router = useRouter()

    useEffect(() => {
        const fetchVendorDetails = async () => {
            setLoading(true)
            try {
                await getVendorCookiesAndFetchVendor().then(res => {
                    if (res.success) {
                        setVendor(res.vendor)
                        toast("Dashboard loading")
                        if (!res.vendor || (res.vendor && !res.vendor.verified)) {
                            router.push("/")
                        }
                    }
                })
            } catch (error: any) {
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchVendorDetails()
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <ModalsProvider>
            <AppShell header={{ height: 60 }} navbar={{
                width: 300,
                breakpoint: "sm",
                collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
            }}
                padding="md">
                <AppShell.Header>
                    <Group h={"100%"} px="md">
                        <Burger
                            opened={mobileOpened}
                            onClick={toggleMobile}
                            hiddenFrom='sm'
                        />
                        <Burger
                            opened={desktopOpened}
                            onClick={toggleDesktop}
                            hiddenFrom='sm'
                        />
                        <Logo />
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md">
                    <div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard"}>
                                <MdSpaceDashboard size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard"}>
                                <div>Vendor Dashboard</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard/coupons"}>
                                <RiCoupon3Fill size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard/coupons"}>
                                <div>Coupons</div>
                            </Link>
                        </div>
                        <div>Orders:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard/orders"}>
                                <IoListCircleSharp size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard/orders"}>
                                <div>Orders</div>
                            </Link>
                        </div>
                        <div>Products:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard/product/all/tabular"}>
                                <FaTable size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard/product/all/tabular"}>
                                <div>All Products</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard/product/create"}>
                                <BsPatchPlus size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard/product/create"}>
                                <div>Create product</div>
                            </Link>
                        </div>
                        <div>Categories:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard/categories"}>
                                <MdOutlineCategory size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard/categories"}>
                                <div>Categories</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard/subCategories"}>
                                <MdOutlineCategory size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard/subCategories"}>
                                <div>SubCategories</div>
                            </Link>
                        </div>
                        <div>Analytics:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/vendor/dashboard/analytics/order"}>
                                <VscGraph size={20} />
                            </Link>
                            <Link href={"/vendor/dashboard/analytics/order"}>
                                <div>order Analytics</div>
                            </Link>
                        </div>
                        <div onClick={logoutVendor} className='cursor-pointer flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <IoIosLogOut size={20} />
                            <div>Logout</div>
                        </div>
                    </div>
                </AppShell.Navbar>
                <AppShell.Main>{children}</AppShell.Main>
            </AppShell>
        </ModalsProvider>
    )
}
