"use client"

import SwitchComponent from '@/components/admin/dashboard/reviews/switch'
import { getLatestProductReviews } from '@/lib/database/actions/admin/products/products.actions'
import { useEffect, useState } from 'react'
import { Star } from 'lucide-react'

function ReviewsPage() {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                await getLatestProductReviews().then(res => {
                    if (res) {
                        setReviews(res)
                    }
                }).catch(console.log)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllReviews()
    }, [])

    if (!reviews || reviews.length === 0) {
        return <p>No reviews found.</p>
    }

    return (
        <div className='container'>
            <h1 className='text-2xl font-bold mb-6'>Latest Reviews</h1>
            <div className='space-y-4'>
                {reviews?.map((reviewData: any, index: number) => {
                    const { productName, productDescription, review, productImage } = reviewData
                    const { rating, review: comment, reviewCreatedAt, reviewBy, verified, _id } = review
                    const { username, email, image } = reviewBy

                    return (
                        <div key={index} className='border-b-2 pb-4 last:border-0'>
                            <div className='flex gap-2..5'>
                                <div>
                                    <img src={productImage[0].url} alt="" className='w-25 object-cover' />
                                </div>
                                <div>
                                    <div className='mb-4'>
                                        <h2 className='text-lg font-semibold'>{productName}</h2>
                                        <p className='text-gray-600'>{productDescription}</p>
                                    </div>

                                    <div className='flex mb-2'>
                                        {Array(5).map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 border-none ${i < rating ? "border-none fill-yellow-400" : "stroke-gray-300"}`} />
                                        ))}
                                    </div>
                                    <p className='mb-2'>{comment}</p>
                                    <div className='flex items-center justify-between text-sm text-gray-500'>
                                        <div className='flex items-center gap-2'>
                                            <img src={image} alt={username} className='w-8 h-8 round-full object-cover' />
                                            <span>{username || email}</span>
                                            <span>|</span>
                                            <span>{new Date(reviewCreatedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className='mt-4'>
                                        <SwitchComponent _id={_id} verified={verified} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ReviewsPage
