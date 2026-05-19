"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function BannerCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    const images = [
        "https://placehold.co/1200x400?text=Slide+1",
        "https://placehold.co/1200x400?text=Slide+2",
        "https://placehold.co/1200x400?text=Slide+3",
        "https://placehold.co/1200x400?text=Slide+4",
    ]

    const nextSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % images.length)
    }
    const prevSlide = () => {
        setCurrentIndex(prevIndex => (prevIndex - 1) >= 0 ? (prevIndex - 1) % images.length : 3)
    }

    useEffect(() => {
        const interval = setInterval(nextSlide, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className='relative w-full h-100 overflow-hidden mb-5'>
            {images.map((src, index) => (
                <div key={src} className={`absolute top-0 w-full h-full transition-opacity duration-500 ease-in-out ${index === currentIndex ? "opacity-100" : "opacity-0"}`}>
                    <img src={src} alt={`Slide ${index + 1}`} className='w-full h-full object-cover' />
                </div>
            ))}
            <Button variant={"outline"} size={"icon"} className='absolute top-1/2 left-4 transform -translate-y-1/2 text-black rounded-none' onClick={prevSlide} aria-label='Previous Slide'>
                <ChevronLeft size={24} />
            </Button>
            <Button variant={"outline"} size={"icon"} className='absolute top-1/2 right-4 transform -translate-y-1/2 text-black rounded-none' onClick={nextSlide} aria-label='Next Slide'>
                <ChevronRight size={24} />
            </Button>
            <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2'>
                {images.map((_, index) => (
                    <Button key={index} className={`w-3 h-3 rounded-full ${index === currentIndex ? "bg-white" : "bg-white/50"}`} onClick={() => setCurrentIndex(index)} aria-label={`Go to slide ${index + 1}`} />
                ))}
            </div>
        </div>
    )
}

export default BannerCarousel
