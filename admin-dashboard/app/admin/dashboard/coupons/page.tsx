"use client"

import CreateVendorCoupon from '@/components/admin/dashboard/coupons/create'
import ListAllVendorCoupons from '@/components/admin/dashboard/coupons/list'
import { getAllCoupons } from '@/lib/database/actions/admin/coupon/coupon.actions'
import { useEffect, useState } from 'react'

const VendorCouponPage = () => {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchAllCoupons = async () => {
            try {
                await getAllCoupons().then(res => {
                    if (res.success) {
                        setData(res?.coupons)
                    } else {
                        alert(res.message)
                    }
                }).catch(alert)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllCoupons()
    }, [])

    return (
        <div className='container'>
            <CreateVendorCoupon setCoupons={setData} />
            <ListAllVendorCoupons coupons={data} setCoupons={setData} />
        </div>
    )
}

export default VendorCouponPage