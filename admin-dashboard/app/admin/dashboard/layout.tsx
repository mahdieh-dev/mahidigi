"use client"

import { AppShell, Burger, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React from 'react'
import { ModalsProvider } from '@mantine/modals'
import Logo from '@/components/logo'
import Link from 'next/link'
import { MdOutlineCategory, MdSpaceDashboard } from "react-icons/md"
import { RiCoupon3Fill } from 'react-icons/ri'
import { IoListCircleSharp } from 'react-icons/io5'
import { FaTable } from 'react-icons/fa'
import { FaRegRectangleList, FaUsers } from 'react-icons/fa6'
import { BsPatchPlus } from 'react-icons/bs'
import { VscGraph } from 'react-icons/vsc'

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    const [mobileOpened, { toggle: toggleMobile }] = useDisclosure()
    const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true)

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
                            <Link href={"/admin/dashboard"}>
                                <MdSpaceDashboard size={20} />
                            </Link>
                            <Link href={"/admin/dashboard"}>
                                <div>Admin Dashboard</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/users"}>
                                <FaUsers size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/users"}>
                                <div>Users</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/vendors"}>
                                <RiCoupon3Fill size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/vendors"}>
                                <div>Vendors</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/coupons"}>
                                <RiCoupon3Fill size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/coupons"}>
                                <div>Coupons</div>
                            </Link>
                        </div>
                        <div>Orders:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/orders"}>
                                <IoListCircleSharp size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/orders"}>
                                <div>Orders</div>
                            </Link>
                        </div>
                        <div>Products:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/product/all/tabular"}>
                                <FaTable size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/product/all/tabular"}>
                                <div>All Products</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/product/create"}>
                                <BsPatchPlus size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/product/create"}>
                                <div>Create product</div>
                            </Link>
                        </div>
                        <div>Categories:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/categories"}>
                                <MdOutlineCategory size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/categories"}>
                                <div>Categories</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/subCategories"}>
                                <MdOutlineCategory size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/subCategories"}>
                                <div>SubCategories</div>
                            </Link>
                        </div>
                        <div>Analytics:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/analytics/order"}>
                                <VscGraph size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/analytics/order"}>
                                <div>order Analytics</div>
                            </Link>
                        </div>
                        <div>Banners:</div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/banners/website"}>
                                <FaRegRectangleList size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/banners/website"}>
                                <div>Website Banners</div>
                            </Link>
                        </div>
                        <div className='flex gap-7.5 items-center p-2.5 rounded-md hover:bg-blue-100'>
                            <Link href={"/admin/dashboard/banners/app"}>
                                <FaRegRectangleList size={20} />
                            </Link>
                            <Link href={"/admin/dashboard/banners/app"}>
                                <div>App Banners</div>
                            </Link>
                        </div>
                    </div>
                </AppShell.Navbar>
                <AppShell.Main>{children}</AppShell.Main>
            </AppShell>
        </ModalsProvider>
    )
}
