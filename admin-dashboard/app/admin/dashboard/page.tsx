"use client"

import DashboardCard from '@/components/admin/dashboard/dashboardCard'
import { calculateTotalOrders, getDashboardData } from '@/lib/database/actions/admin/dashboard/dashboard.actions'
import { HiCurrencyDollar } from "react-icons/hi"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { FaCheckCircle } from 'react-icons/fa'
import { IoIosCloseCircle } from 'react-icons/io'
import Link from 'next/link'
import { SlEye } from 'react-icons/sl'
import { useEffect, useRef, useState } from 'react'
import ProductData from '@/components/admin/dashboard/product.performance'
import LowStockProducts from '@/components/admin/dashboard/low-stock.products'
import OutOfStockProducts from '@/components/admin/dashboard/out-of-stock.products'

function AdminDashboardPage() {
    const [data, setData] = useState<{
        orders: any;
        products: any;
    } | null>(null)
    const [allOrdersData, setAllOrdersData] = useState<{
        todaySales: number;
        totalSales: number;
        lastMonthSales: number;
        lastWeekSales: number;
        growthPercentage: string;
    } | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                await getDashboardData().then(res => {
                    setData(res)
                })
            } catch (error) {
                console.log(error)
            }
        }

        fetchData()
    }, [])

    useEffect(() => {
        const calculateOrders = async () => {
            try {
                await calculateTotalOrders().then(res => {
                    setAllOrdersData(res)
                })
            } catch (error) {
                console.log(error)
            }
        }

        calculateOrders()
    }, [])

    return (
        <div className='container'>
            <div className='my-5'>
                <DashboardCard data={data} />
            </div>
            {/* Orders */}
            <div className='titleStyle'>Orders</div>
            <div className='flex justify-evenly items-center my-5'>
                <div className='h-25 gap-2.5 border-2 border-gray-400 p-2.5 w-50 shadow-2xl flex items-center justify-center rounded-3xl'>
                    <HiCurrencyDollar size={100} /> {allOrdersData?.totalSales ?? 0} USD Total Orders
                </div>
                <div className='h-25 gap-2.5 border-2 border-gray-400 p-2.5 w-50 shadow-2xl flex items-center justify-center rounded-3xl'>
                    <HiCurrencyDollar size={100} /> {allOrdersData?.lastWeekSales ?? 0} USD Last Week Orders
                </div>
                <div className='h-25 gap-2.5 border-2 border-gray-400 p-2.5 w-50 shadow-2xl flex items-center justify-center rounded-3xl'>
                    <HiCurrencyDollar size={100} /> {allOrdersData?.lastMonthSales ?? 0} USD Last Month Orders
                </div>
                <div className='h-25 gap-2.5 border-2 border-gray-400 p-2.5 w-50 shadow-2xl flex items-center justify-center rounded-3xl'>
                    <HiCurrencyDollar size={100} /> {allOrdersData?.growthPercentage ?? 0} USD Growth Percentage
                </div>
            </div>
            <div className='my-5'>
                <div w-full min-w-full>
                    <div className='my-5'>
                        <div className='SecondaryTitleStyle'>Recent Orders</div>
                    </div>
                    <div className='w-full'>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ border: "2px solid black" }}>
                                            Name
                                        </TableCell>
                                        <TableCell style={{ border: "2px solid black" }}>
                                            Total
                                        </TableCell>
                                        <TableCell style={{ border: "2px solid black" }}>
                                            Payment
                                        </TableCell>
                                        <TableCell style={{ border: "2px solid black" }}>
                                            View
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data?.orders?.map((order, index) => (
                                        <TableRow key={index}>
                                            <TableCell style={{ border: "2px solid black" }}>
                                                {order?.user?.email}
                                            </TableCell>
                                            <TableCell style={{ border: "2px solid black" }}>
                                                USD {order?.total}
                                            </TableCell>
                                            <TableCell style={{ border: "2px solid black" }}>
                                                {order.isPaid ? (
                                                    <FaCheckCircle size={23} color={"green"} />
                                                ) : (
                                                    <IoIosCloseCircle size={25} color={"red"} />
                                                )}
                                            </TableCell>
                                            <TableCell style={{ border: "2px solid black" }}>
                                                <Link href={`/orders/${order._id}`}>
                                                    <SlEye />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
            <ProductData />
            <LowStockProducts />
            <OutOfStockProducts />
        </div>
    )
}

export default AdminDashboardPage
