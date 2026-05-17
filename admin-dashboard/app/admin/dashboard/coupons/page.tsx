"use client"

import CreateAdminCoupon from '@/components/admin/dashboard/coupons/create'
import ListAllAdminCoupons from '@/components/admin/dashboard/coupons/list'
import { getAllCoupons } from '@/lib/database/actions/admin/coupon/coupon.actions'
import { useEffect, useState } from 'react'

const AdminCouponPage = () => {
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
            <CreateAdminCoupon setCoupons={setData} />
            <ListAllAdminCoupons coupons={data} setCoupons={setData} />
        </div>
    )
}

export default AdminCouponPage