import { updateOrderToOldOrder, updateProductOrderStatus } from "@/lib/database/actions/vendor/orders/orders.actions";
import { Paper, Select } from "@mantine/core";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Table, Box, Collapse, IconButton, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation"
import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import styles from "./data-table.module.css"


const options = [
    { value: "Not Processed", text: "Not Processed" },
    { value: "Processing", text: "Processing" },
    { value: "Dispatched", text: "Dispatched" },
    { value: "Cancelled", text: "Cancelled" },
    { value: "Completed", text: "Completed" },
]

function Row(props: any) {
    const router = useRouter()
    const { row } = props;
    const [open, setOpen] = useState(false)

    const handleChange = async (e: any, productId: string, orderId: string) => {
        await updateProductOrderStatus(orderId, productId, e.target.value).then(res => {
            alert(res ?? "_____")
            router.refresh()
        }).catch(console.log)
    }

    const changeOrderToOld = async (id: string) => {
        await updateOrderToOldOrder(id).then(res => {
            alert(res ?? "")
            router.refresh()
        }).catch(console.log)
    }

    return (
        <React.Fragment>
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                <TableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell component={"th"} scope="row">{row._id}</TableCell>
                <TableCell align="right">{row.paymentMethod === "razorPay" ? "RazorPay" : row.paymentMethod == "cash" && "Cash on Delivery"}</TableCell>
                <TableCell align="left">{row.isPaid ? <FaCheckCircle size={23} color="green" /> : <IoIosCloseCircle size={25} color="red" />}</TableCell>
                <TableCell align="right"><b>USD. {row.total}</b></TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout={"auto"} unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component={"div"}>Order for</Typography>
                            <Table size={"small"} aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Change Order</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell align="right">Shipping Information</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow key={row.user.id}>
                                        <TableCell component={"th"} scope="row">
                                            <img src={row.user.image} className={styles.table__img} alt="" />
                                        </TableCell>
                                        <TableCell>
                                            {row.isNew ? (<div>
                                                I checked this order, change order to old <br />
                                                <button className="btn" onClick={() => changeOrderToOld(row._id)}>Check</button>
                                            </div>) : (
                                                <div>This is old order</div>
                                            )}
                                        </TableCell>
                                        <TableCell align="left">{row.user.email}</TableCell>
                                        <TableCell align="right">
                                            {row.shippingAddress.firstName}{" "}
                                            {row.shippingAddress.lastName}<br />
                                            {row.shippingAddress.address1}<br />
                                            {row.shippingAddress.address2}<br />
                                            {row.shippingAddress.state},{row.shippingAddress.city}{" "}<br />
                                            {row.shippingAddress.country} <br />
                                            {row.shippingAddress.zipCode} <br />
                                            {row.shippingAddress.phoneNumber} <br />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout={"auto"} unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component={"div"}>Order items</Typography>
                            <Table size={"small"} aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell>Name</TableCell>
                                        <TableCell>Size</TableCell>
                                        <TableCell>Qty</TableCell>
                                        <TableCell>Price</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Vendor Id</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        row.products.map((p: any) => (
                                            <TableRow key={row.user.id}>
                                                <TableCell component={"th"} scope="row">
                                                    <div className="relative inline-block">
                                                        <img src={p.image} className={"w-25"} alt="" />
                                                        {
                                                            p.vendor && (
                                                                <div className="absolute top-0 right-0 bg-[#EB4F0C] text-2.5 p-2">{p.vendor.name}</div>
                                                            )
                                                        }
                                                    </div>
                                                </TableCell>
                                                <TableCell>{p.name}</TableCell>
                                                <TableCell align="left">{p.size}</TableCell>
                                                <TableCell align="left">{p.qty}</TableCell>
                                                <TableCell align="left">{p.price}</TableCell>
                                                <TableCell align="left">
                                                    <b className={`py-0.5 px-1.25 ${p.status === "Not Processed" ? "bg-[#e6554191]" : p.status === "Processing" ? "bg-[#54b7d3]" : p.status === "Dispatched" ? "bg-[#1e91cf]" : p.status === "Cancelled" ? "bg-[#e3d4d4]" : p.status === "Completed" ? "bg-[#4cb64c]" : p.status === "Processing Refund" ? "bg-red-500 rounded-md p-1.25" : ""
                                                        }`}>{p.status}</b>
                                                    <br />
                                                    <br />
                                                    <select className="border border-black" value={p.status} onChange={e => handleChange(e, p._id, row._id)}>
                                                        {options.map(option => (
                                                            <option key={option.value} value={option.value}>{option.text}</option>
                                                        ))}
                                                    </select>
                                                </TableCell>
                                                <TableCell align="left">{p.vendor._id ?? "-"}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                    <TableRow key={row._id}>
                                        <TableCell component={"th"} scope="row" align="left">Total</TableCell>
                                        <TableCell />
                                        <TableCell align="left" />
                                        <TableCell align="left" />
                                        <TableCell align="left" style={{ padding: "20px 0 20px 18px" }}>
                                            <b style={{ fontSize: "20px" }}>USD {row.total}</b>
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment >
    )
}

export default function AllOrdersTable({ rows, range, setRange, isPaid, setIsPaid, paymentMethod, setPaymentMethod }: { rows?: any[], range?: any, setRange?: any, isPaid?: any, setIsPaid?: any, paymentMethod?: any, setPaymentMethod?: any }) {
    const [searchOrderText, setSearchOrderText] = useState<string>("")
    const [filteredRowsByText, setFilteredRowsByText] = useState<any[]>([])

    useEffect(() => {
        if (searchOrderText.length === 24) {
            const filteredRows = rows?.filter(item => item._id.toString() === searchOrderText.toString())
            setFilteredRowsByText(filteredRows || [])
        } else {
            setFilteredRowsByText([])
        }
    }, [searchOrderText, rows])

    return (
        <div>
            <div>
                <h1 className="font-bold text-2xl">Total Orders - {rows?.length ?? 0}</h1>
                <div className="mt-4">
                    <div className="flex gap-2.5">
                        <TextField id="outlined-basic" label="Search Order By ID" variant="outlined" className="w-[50%] flex justify-center bg-gray-100 rounded-md" onChange={e => setSearchOrderText(e.target.value)} />
                        <Select label="Order Range" placeholder="Pick a range" value={range} onChange={setRange} data={[
                            { value: "all", label: "All Orders" },
                            { value: "today", label: "Today" },
                            { value: "today_and_yesterday", label: "Today and Yesterday" },
                            { value: "2d", label: "Last 2 Days" },
                            { value: "7d", label: "Last 7 Days" },
                            { value: "15d", label: "Last 15 Days" },
                            { value: "30d", label: "Last 30 Days" },
                            { value: "2m", label: "Last 2 Months" },
                            { value: "5m", label: "Last 5 Months" },
                            { value: "10m", label: "Last 10 Months" },
                            { value: "12m", label: "Last 12 Months" },
                        ]} />

                        <Select label="Order Payment Status" placeholder="Pick a status" value={isPaid} onChange={setIsPaid} data={[
                            { value: "-", label: "Order Payment Status" },
                            { value: "paid", label: "Paid" },
                            { value: "unpaid", label: "Not Paid" },
                        ]} />

                        <Select label="Order Payment Method" placeholder="Pick a method" value={paymentMethod} onChange={setPaymentMethod} data={[
                            { value: "-", label: "Order Payment Method" },
                            { value: "cash", label: "COD" },
                            { value: "razorPay", label: "RazorPay" },
                        ]} />
                    </div>
                </div>

                <TableContainer component={Paper} className="mt-4">
                    <Typography sx={{ flex: "1 1 100%" }} variant="h6" id="tableTitle" component={"div"}>Orders</Typography>
                    <Table aria-label="collapsible table" className={styles.table}>
                        <TableHead>
                            <TableRow>
                                <TableCell />
                                <TableCell>Order</TableCell>
                                <TableCell>New</TableCell>
                                <TableCell align="right">Payment Method</TableCell>
                                <TableCell align="right">Paid</TableCell>
                                <TableCell align="right">Coupon</TableCell>
                                <TableCell align="right">Total</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {searchOrderText.length === 24 ? filteredRowsByText.map(row => (
                                <Row key={row._id} row={row} />
                            )) : rows?.map(row => <Row key={row._id} row={row} />)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}