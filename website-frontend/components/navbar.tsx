"use client"

import { useEffect, useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { ChevronRight, Menu, Package, Search, Truck, User } from "lucide-react"
import { RiDiscountPercentFill } from "react-icons/ri"
import { LuStore } from "react-icons/lu"
import { GrLike } from "react-icons/gr"
import { GiPerfumeBottle } from "react-icons/gi"
import { FaBath } from "react-icons/fa"
import { PiHighlighterCircleBold } from "react-icons/pi"
import { MdFace4 } from "react-icons/md"
import { useAtom } from "jotai"
import SearchModal from "./searchModal"
import { hamburgerMenuOpenAtom } from "@/store"
import Link from "next/link"
import SignInPopup from "./signInPopup"
import CartDrawer from "./cart/cartDrawer"

export default function NavBar() {
    const [hamMenuOpen, setHamMenuOpen] = useAtom(hamburgerMenuOpenAtom)
    const [open, setOpen] = useState(false)

    const navItems = [
        { name: "CRAZY DEALS", icon: <RiDiscountPercentFill size={22} /> },
        { name: "SHOP ALL", icon: <LuStore size={22} /> },
        { name: "BEST SELLERS", icon: <GrLike size={22} /> },
        {
            name: "PERFUMES",
            icon: <GiPerfumeBottle size={22} />,
            hasSubMenu: true,
        },
        {
            name: "BATH & BODY",
            icon: <FaBath size={22} />,
            hasSubMenu: true,
        },
        { name: "MAKEUP", icon: <PiHighlighterCircleBold size={22} /> },
        {
            name: "SKINCARE",
            icon: <MdFace4 size={22} />,
            hasSubMenu: true,
        },
    ]

    return (
        <nav className="w-full bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-15 items-center justify-between">
                    <div className="flex items-center lg:w-1/3">
                        <Sheet open={hamMenuOpen} onOpenChange={setHamMenuOpen}>
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="mr-2 lg:hidden"
                                    aria-label="Open menu"
                                >
                                    <Menu size={24} />
                                </Button>
                            </SheetTrigger>

                            <SheetContent
                                side="left"
                                className="w-[82vw] max-w-95 overflow-y-auto p-0 sm:max-w-105"
                            >
                                <div className="flex min-h-full flex-col bg-white">
                                    <div className="px-5 pb-4 pt-5">
                                        <div className="flex items-center gap-3 pr-8">
                                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border-2 border-black">
                                                <User size={28} />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-base font-semibold leading-5">
                                                    Download our app
                                                </p>
                                                <p className="mt-1 text-sm text-muted-foreground">
                                                    and get 10% OFF!
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Button className="h-11 w-full rounded-none bg-red-500 text-base font-semibold hover:bg-red-600">
                                        Download App
                                    </Button>

                                    <div className="grid grid-cols-2 gap-3 px-5 py-5">
                                        <Button
                                            variant="outline"
                                            className="h-12 justify-center gap-2 rounded-none border-0 bg-[#E4E4E4] text-sm font-medium shadow-none hover:bg-[#d8d8d8]"
                                        >
                                            <Package size={18} />
                                            <span>My Orders</span>
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="h-12 justify-center gap-2 rounded-none border-0 bg-[#E4E4E4] text-sm font-medium shadow-none hover:bg-[#d8d8d8]"
                                        >
                                            <Truck size={18} />
                                            <span>Track Order</span>
                                        </Button>
                                    </div>

                                    <div className="border-t border-gray-200">
                                        {navItems.map((item) => (
                                            <button
                                                key={item.name}
                                                type="button"
                                                className="flex h-14 w-full items-center justify-between border-b border-gray-200 px-5 text-left transition-colors hover:bg-gray-50"
                                            >
                                                <div className="flex min-w-0 items-center gap-4">
                                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center text-black">
                                                        {item.icon}
                                                    </span>

                                                    <span className="truncate text-sm font-semibold tracking-wide text-black">
                                                        {item.name}
                                                    </span>
                                                </div>

                                                {item.hasSubMenu && (
                                                    <ChevronRight size={20} className="shrink-0" />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        <div className="hidden w-full max-w-xs lg:block">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                    size={20}
                                />

                                <input
                                    type="search"
                                    placeholder="Search"
                                    className="w-full border-b-2 border-black py-2 pl-10 pr-4 outline-none"
                                    onClick={() => setOpen(true)}
                                />
                            </div>

                            {open && <SearchModal open={open} setOpen={setOpen} />}
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center lg:w-1/3">
                        <Link href={"/"}>
                            {" "}
                            <h1 className="text-2xl font-bold">MahiDigi</h1>
                        </Link>
                    </div>

                    <div className="flex items-center justify-end lg:w-1/3">
                        <SignInPopup />
                        <CartDrawer />
                    </div>
                </div>
                {/* for small screens */}
                <div className="lg:hidden">
                    <div className="relative">
                        <Search
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            size={20}
                        />

                        <input
                            type="search"
                            placeholder="Search for your favorite products"
                            className="w-full border-b-2 border-black py-2 pl-10 pr-4 outline-none"
                            onClick={() => setOpen(true)}
                        />
                    </div>
                    {open && <SearchModal open={open} setOpen={setOpen} />}
                </div>
            </div>
            <div className="hidden lg:block border-t border-gray-200 mt-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-evenly py-3">
                        {navItems.map(item => (
                            <Link key={item.name} href="#" className="text-sm font-medium text-gray-700 hover:text-black group transition duration-300">
                                {item.name}
                                <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 bg-black"></span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    )
}