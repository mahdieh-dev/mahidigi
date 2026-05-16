"use client"

import { getTopSellingProducts, sizeAnalytics } from "@/lib/database/actions/admin/analytics/analytics.vendor.actions"
import { useEffect, useState } from "react"
import { Cell, Pie, PieChart } from "recharts"

const COLORS = [
    "#0088FE", "#00C49F",
    "#FFBB28", "#FF8042",
    "#FF6384", "#36A2EB",
    "#FFCE56", "#4BC0C0",
    "#9966FF", "#FF9F40"
]

const ProductData = () => {
    const [sizeData, setSizeData] = useState([])
    const [topSellingProducts, setTopSellingProducts] = useState([])

    useEffect(() => {
        async function fetchSizeDataForProducts() {
            await sizeAnalytics().then(setSizeData).catch(console.log)
        }
        fetchSizeDataForProducts()

        async function topSellingProducts() {
            await getTopSellingProducts().then(setTopSellingProducts).catch(console.log)
        }
        topSellingProducts()
    }, [])

    return (
        <div>
            <div className="SecondaryTitleStyle">Product Performance</div>
            <div className="flex gap-2.5 my-5">
                <div className="shadow-xl bg-gray-200 rounded-xl w-[50%]">
                    <p className="px-5 py-5 text-2xl font-bold">
                        Size Performance for the product:
                    </p>
                    {sizeData?.length > 0 ? (
                        <PieChart width={800} height={400} className="-ml-25">
                            <Pie data={sizeData} cx={400} cy={200} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey={"value"}>
                                {sizeData?.length > 0 && sizeData.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    ) : (
                        <div className="flex justify-center items-center">
                            No Data Found
                        </div>
                    )}
                </div>
                <div className="shadow-xl bg-gray-200 rounded-xl w-[50%]">
                    <p className="px-5 py-5 text-2xl font-bold">
                        Top selling products:
                    </p>
                    {topSellingProducts?.length > 0 ? (
                        <PieChart width={800} height={400} className="-ml-25">
                            <Pie data={topSellingProducts} cx={400} cy={200} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                outerRadius={150}
                                fill="#8884d8"
                                dataKey={"value"}>
                                {topSellingProducts?.length > 0 && topSellingProducts.map((_, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </PieChart>
                    ) : (
                        <div className="flex justify-center items-center">
                            No Data Found
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ProductData