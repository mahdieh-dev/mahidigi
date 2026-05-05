"use client"

import { useEffect, useState } from "react"
import { getLowStockProducts } from "@/lib/database/actions/vendor/dashboard/dashboard.actions"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

const LowStockProducts = () => {
    const [products, setProducts] = useState<{
        lowStockProducts: any;
    } | null>(null)

    useEffect(() => {
        async function getLowStock() {
            await getLowStockProducts().then(res => setProducts(res)).catch(console.log)
        }
        getLowStock()
    }, [])

    return (
        <div className="w-full container">
            <div className="SecondaryTitleStyle">Low Stock Products</div>
            <div>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Size</TableCell>
                                <TableCell>Stock Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products?.lowStockProducts?.length > 0 ? (
                                products?.lowStockProducts.map(product =>
                                    product.subProducts?.map(subProduct =>
                                        subProduct.sizes?.map(size => {
                                            if (size && size.qty < 2) {
                                                return (
                                                    <TableRow key={size._id}>
                                                        <TableCell>{product.name}</TableCell>
                                                        <TableCell>{size.size}</TableCell>
                                                        <TableCell>{size.qty}</TableCell>
                                                    </TableRow>
                                                )
                                            }

                                            return null
                                        })
                                    )
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        no low stock products found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    )
}

export default LowStockProducts