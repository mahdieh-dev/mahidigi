"use client"

import AllOrdersTable from '@/components/vendor/dashboard/orders/data-table'
import { getAllOrders } from '@/lib/database/actions/vendor/orders/orders.actions'
import { getVendorCookiesAndFetchVendor } from '@/lib/database/actions/vendor/vendor.actions'
import { useEffect, useState } from 'react'

type DateRange = "today" | "yesterday" | "2d" | "7d" | "15d" | "30d" | "2m" | "5m" | "10m" | "12m" | "all" | "today_and_yesterday"
type PaymentStatus = "paid" | "unpaid" | "-"
type PaymentMethod = "cash" | "RazorPay" | "-"

function OrdersPage() {
    const [vendor, setVendor] = useState("")
    const [loading, setLoading] = useState(false)
    const [orders, setOrders] = useState()
    const [range, setRange] = useState<DateRange>("today")
    const [isPaid, setIsPaid] = useState<PaymentStatus>("-")
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("-")

    useEffect(() => {
        async function fetchVendorDetails() {
            await getVendorCookiesAndFetchVendor().then(res => {
                if (res.success) {
                    setVendor(res.vendor._id)
                }
            }).catch(console.log)
        }

        fetchVendorDetails()
    }, [])

    useEffect(() => {
        async function getAllOrdersForVendor() {
            if (vendor) {
                try {
                    await getAllOrders(vendor, range, isPaid, paymentMethod).then(res => {
                        setOrders(res)
                    }).catch(alert)
                } catch (error) {
                    console.log(error)
                } finally {
                    setLoading(false)
                }
            }
        }

        getAllOrdersForVendor()
    }, [vendor, range, isPaid, paymentMethod])

    return (
        <div>
            <AllOrdersTable
                rows={orders}
                range={range}
                setRange={setRange}
                setIsPaid={setIsPaid}
                isPaid={isPaid}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
            />
        </div>
    )
}

export default OrdersPage
