"use client"

import { cartMenuOpenAtom } from '@/store'
import { useAtom } from 'jotai'
import React, { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Minus, Plus, ShoppingBag, Trash } from 'lucide-react';
import Link from 'next/link';

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

function CartDrawer() {
    const [cartMenuOpen, setCartMenuOpen] = useAtom(cartMenuOpenAtom)
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: "1",
            name: "High-End Fragrance Collection for Males",
            price: 1615,
            quantity: 4,
            image: "https://placehold.co/70x70"
        },
        {
            id: "2",
            name: "High-End Fragrance Collection for Males",
            price: 2300,
            quantity: 4,
            image: "https://placehold.co/70x70"
        },
    ])

    const handleOnClickCartMenu = () => {
        setCartMenuOpen(prev => !prev)
    }

    const removeItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id))
    }

    const updateQuantity = (id: string, newQuantity: number) => {
        setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item))
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return (
        <div>
            <Sheet open={cartMenuOpen} onOpenChange={handleOnClickCartMenu}>
                <SheetTrigger asChild>
                    <Button variant={"ghost"} size={"icon"} className='relative'>
                        <ShoppingBag size={24} />
                        <span className='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-black rounded-full'>
                            {cartItems.length}
                        </span>
                    </Button>
                </SheetTrigger>
                <SheetContent className='w-[90%] max-w-112.5 sm:max-w-135 p-4 sm:p-6'>
                    <SheetHeader>
                        <SheetTitle className='subHeading'>CART</SheetTitle>
                    </SheetHeader>

                    <div className='mt-4 space-y-4'>
                        {cartItems.map(item => (
                            <div key={item.id} className='flex items-start space-x-4 border-b-2 pb-3'>
                                <img src={item.image} alt={item.name} className='w-16 sm:w-20 sm:h-20 object-cover' />
                                <div className='flex-1'>
                                    <h3 className='font-semibold text-xs sm:text-sm text-gray-500 mt-1'>{item.name}</h3>
                                    <p className='text-xs sm:text-sm text-gray-500 mt-1'>Buy More Save More</p>
                                    <div className='flex items-center justify-between mt-2'>
                                        <div className='flex items-center'>
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className='p-1'>
                                                <Minus className='w-4 h-4' />
                                            </button>
                                            <span className='mx-2'>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className='p-1'>
                                                <Plus className='w-4 h-4' />
                                            </button>
                                        </div>
                                        <p className='font-semibold text-xs sm:text-base'>${item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className='text-right'>
                                    <button onClick={() => removeItem(item.id)} className='text-gray-500 hover:text-gray-700'>
                                        <Trash size={24} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='absolute bottom-4 right-4 w-[90%] mt-6'>
                        <p className='text-sm text-gray-500 text-center'>Tax included. Shipping calculated at checkout.</p>
                        <Link href={"/checkout"}>
                            <Button className='w-full mt-4 bg-black text-white hover:bg-gray-800 shadow-lg'>
                                CHECKOUT - ${total.toFixed()}
                            </Button>
                        </Link>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}

export default CartDrawer
