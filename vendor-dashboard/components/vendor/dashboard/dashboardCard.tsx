"use client"

import { SlHandbag } from "react-icons/sl"
import { SiProducthunt } from "react-icons/si"
import { GiTakeMyMoney } from "react-icons/gi"

const DashboardCard = ({ data }: { data: any }) => {
    return (
        <div>
            <div className="titleStyle">Dashboard</div>
            <div className="flex justify-evenly items-center">
                <div className="h-50 w-50 shadow-2xl bg-green-400 flex items-center rounded-3xl">
                    <SlHandbag size={35} /> + {data?.orders.length} Total Orders
                </div>
                <div className="h-50 w-50 shadow-2xl bg-orange-400 flex items-center rounded-3xl">
                    <SiProducthunt size={35} /> + {data?.products.length} Total Products
                </div>
                <div className="h-50 w-50 shadow-2xl bg-pink-400 flex items-center rounded-3xl">
                    <GiTakeMyMoney size={35} />
                    <div>
                        +${data?.orders.reduce((a, val) => a + val.total, 0)}
                        <span>
                            - ${" "}
                            {data?.orders.filter(o => !o.isPaid).reduce((a, val) => a + val.total, 0).toFixed(2)}{" "}
                            Unpaid yet.
                        </span>
                        Total Earnings.
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DashboardCard