"use client"

import CreateVendorCoupon from '@/components/vendor/dashboard/coupons/create'
import ListAllVendorCoupons from '@/components/vendor/dashboard/coupons/list'
import { getAllCoupons } from '@/lib/database/actions/vendor/coupon/coupon.actions'
import { getVendorCookiesAndFetchVendor } from '@/lib/database/actions/vendor/vendor.actions'
import { useEffect, useState } from 'react'

const VendorCouponPage = () => {
    const [vendor, setVendor] = useState(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchVendorDetails = async () => {
            try {
                setLoading(true)
                await getVendorCookiesAndFetchVendor().then(res => {
                    if (res.success) {
                        setVendor(res.vendor._id)
                    }
                }).catch(alert)
            } catch (error) {
                alert(error)
                console.log(error)
            } finally {
                setLoading(false)
            }
        }

        fetchVendorDetails()
    }, [])

    useEffect(() => {
        const fetchAllCoupons = async () => {
            if (vendor) {
                try {
                    await getAllCoupons(vendor).then(res => {
                        if (res.success) {
                            setData(res?.coupons)
                        } else {
                            alert(res.message)
                        }
                    }).catch(alert)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        fetchAllCoupons()
    }, [vendor])

    return (
        <div className='container'>
            <CreateVendorCoupon setCoupons={setData} />
            <ListAllVendorCoupons coupons={data} setCoupons={setData} />
        </div>
    )
}

export default VendorCouponPage