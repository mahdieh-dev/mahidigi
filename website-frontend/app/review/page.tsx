import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import React from 'react'

interface Review {
    rating: number;
    comment: string;
    author: string;
    date: string;
    helpful: number;
    unhelpful: number;
}

function ReviewPage({ params }: { params: Review }) {
    const reviews: Review[] = [
        {
            rating: 5,
            comment: "Cool",
            date: "20 Nov 2024",
            author: "Mary Janes",
            helpful: 0,
            unhelpful: 0
        },
        {
            rating: 4,
            comment: "Good t-shirt but a thicker material would have been even better.",
            date: "20 Nov 2024",
            author: "Vyshali Reddy",
            helpful: 0,
            unhelpful: 0
        },
        {
            rating: 4,
            comment: "Good t-shirt. Nice print.",
            date: "20 Nov 2024",
            author: "Vasundhra",
            helpful: 0,
            unhelpful: 0
        },
    ]

    const ratingCounts: any = {
        5: 58,
        4: 16,
        3: 3,
        2: 0,
        1: 1
    }

    const totalRating = Object.values(ratingCounts).reduce((a, b) => a + b, 0)
    const averageRating = ((Object.entries(ratingCounts).reduce((acc, [ratingCounts, count]) => acc + Number(ratingCounts) * Number(count), 0)) / Number(totalRating)).toFixed(1)

    return (
        <div>
            <div className='max-w-7xl mx-auto p-4 md:p-6'>
                <div className='grid md:grid-cols-2 gap-8'>
                    <div className='md:sticky md:top-6 md:self-start'>
                        <Card className='p-6'>
                            <img src={"https://placehold.co/300x400"} alt='Crazymonk T-shirt' className='w-full rounded-lg mb-4' width={400} height={300} />
                            <h1 className='text-2xl font-bold mb-2'>Product Name</h1>
                            <p className='text-gray-600 mb-4'>Product Description</p>
                            <div className='flex items-baseline gap-2 mb-6'>
                                <span className='text-2xl font-bold'>$699</span>
                                <span className='text-gray-500 line-through'>$1499</span>
                                <span className='text-orange-500'>($800 OFF)</span>
                            </div>
                        </Card>
                    </div>
                    <div className='space-y-8'>
                        <Card className='p-6'>
                            <div className='flex items-center gap-2 mb-4'>
                                <h2 className='text-xl font-semibold'>RATINGS</h2>
                                <Star className='w-5 h-5' />
                            </div>
                            <div className='grid md:grid-cols-2 gap-8 mb-8'>
                                <div className='flex items-center gap-4'>
                                    <div className='text-5xl font-bold'>{averageRating}</div>
                                    <div className='flex flex-col'>
                                        <div className='flex'>
                                            {Array(5).map((_, i) => (
                                                <Star className={`w-4 h-4 ${i < Math.floor(Number(averageRating)) ? "fill-primary stroke-primary" : "stroke-gray-300"}`} key={i} />
                                            ))}
                                        </div>
                                        <div className='text-sm text-gray-500'>
                                            {totalRating} Verified Buyers
                                        </div>
                                    </div>
                                </div>

                                <div className='space-y-2'>
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <div key={rating} className='flex items-center gap-2'>
                                            <span className='w-3'>{rating}</span>
                                            <Star className='w-4 h-4' />
                                            <div className='flex-1 h-2 bg-gray-100 rounded-full overflow-hidden'>
                                                <div className='h-full bg-primary' style={{ width: `${(ratingCounts[rating] / Number(totalRating)) * 100}%` }}></div>
                                                <span className='text-sm text-gray-500 w-8'>{ratingCounts[rating]}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                        <Card className='p-6'>
                            <div className='space-y-6'>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-lg font-semibold'>Customer Reviews ({reviews.length})</h3>
                                    <Select defaultValue='helpful'>
                                        <SelectTrigger className='w-25'>
                                            <SelectValue placeholder="Sort by" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value='helpful'>Most Helpful</SelectItem>
                                            <SelectItem value='recent'>Most Recent</SelectItem>
                                            <SelectItem value='highest'>highest Rated</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className='space-y-4'>
                                    {reviews.map((review, index) => (
                                        <div key={index} className='border-b pb-4 last:border-0'>
                                            <div className='flex mb-2'>
                                                {Array(5).map((_, i) => (
                                                    <Star className={`w-4 h-4 ${i < Math.floor(Number(averageRating)) ? "fill-primary stroke-primary" : "stroke-gray-300"}`} key={i} />
                                                ))}
                                            </div>
                                            <p className='mb-2'>{review.comment}</p>
                                            <div className='flex items-center justify-between text-sm text-gray-500'>
                                                <div className='flex items-center gap-2'>
                                                    <span>{review.author}</span>
                                                    <span></span>
                                                    <span>{review.date}</span>
                                                </div>
                                                <div className='flex items-center gap-4'>
                                                    <Button variant={"ghost"} size="sm" className='gap-2'>
                                                        <ThumbsUp className='w-4 h-4' />
                                                        <span>{review.helpful}</span>
                                                    </Button>
                                                    <Button variant={"ghost"} size="sm" className='gap-2'>
                                                        <ThumbsDown className='w-4 h-4' />
                                                        <span>{review.unhelpful}</span>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewPage
