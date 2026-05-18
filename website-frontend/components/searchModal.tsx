"use client"

import React, { SetStateAction } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog"
import { Button } from "./ui/button"
import { X } from "lucide-react"
import { Input } from "./ui/input"

function SearchModal({
    open,
    setOpen,
}: {
    open: boolean
    setOpen: React.Dispatch<SetStateAction<boolean>>
}) {
    const trendingSearches = [
        "Perfume",
        "Bath & Body",
        "Gifting",
        "Crazy Deals",
        "Combos",
    ]

    const recommendedProducts = [
        {
            id: 1,
            name: "Intense Men Perfume",
            price: 849,
            originalPrice: 1099,
            discount: 23,
            image: "https://placehold.co/300x300",
        },
        {
            id: 2,
            name: "Fresh Body Mist",
            price: 549,
            originalPrice: 799,
            discount: 31,
            image: "https://placehold.co/300x300",
        },
        {
            id: 3,
            name: "Luxury Gift Combo",
            price: 1299,
            originalPrice: 1599,
            discount: 19,
            image: "https://placehold.co/300x300",
        },
        {
            id: 4,
            name: "Daily Skincare Set",
            price: 999,
            originalPrice: 1399,
            discount: 29,
            image: "https://placehold.co/300x300",
        },
    ]

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="w-[calc(100vw-2rem)] max-w-md sm:max-w-lg lg:max-w-2xl p-4 sm:p-6">
                <DialogHeader>
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-semibold">
                            Search
                        </DialogTitle>
                    </div>
                </DialogHeader>

                <Input
                    type="search"
                    placeholder="Search"
                    className="w-full"
                />

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Trending Searches</h3>

                    <div className="flex flex-wrap gap-2">
                        {trendingSearches.map((search) => (
                            <Button
                                key={search}
                                variant="outline"
                                size="sm"
                                type="button"
                            >
                                {search}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-semibold">Recommended For You</h3>

                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {recommendedProducts.map((product) => (
                            <div key={product.id} className="space-y-2">
                                <div className="relative aspect-square overflow-hidden rounded-md bg-muted">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />

                                    <span className="absolute left-2 top-2 rounded bg-green-500 px-2 py-1 text-xs text-white">
                                        {product.discount}% OFF
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h4 className="line-clamp-2 text-sm font-semibold">
                                        {product.name}
                                    </h4>

                                    <div className="flex items-baseline gap-2">
                                        <span className="font-bold">${product.price}</span>
                                        <span className="text-sm text-gray-500 line-through">
                                            ${product.originalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default SearchModal