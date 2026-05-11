"use client"

import ProductsDataTable from '@/components/vendor/dashboard/products/data.products.table'
import { getVendorProducts } from '@/lib/database/actions/vendor/products/products.actions'
import { getVendorCookiesAndFetchVendor } from '@/lib/database/actions/vendor/vendor.actions'
import { useEffect, useState } from 'react'

function AllProductsPage() {
    const [vendor, setVendor] = useState("")
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function fetchVendorDetails() {
            try {
                await getVendorCookiesAndFetchVendor().then(res => {
                    if (res.success) {
                        setVendor(res.vendor._id)
                    } else {
                        console.log(res.message)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

        fetchVendorDetails()
    }, [])

    useEffect(() => {
        async function fetchAllProducts() {
            try {
                setLoading(true)
                await getVendorProducts(vendor).then(res => {
                    setProducts(res)
                }).catch(console.log)
            } catch (error) {
                console.log(error)
                alert(error)
            } finally {
                setLoading(false)
            }
        }

        if (vendor) {
            fetchAllProducts()
        }
    }, [vendor])

    return (
        <div className='container'>
            <div className='mb-4 titleStyle'>All Products</div>
            {Array.isArray(products) && products.length > 0 ? (
                <ProductsDataTable products={products} />
            ) : (
                <p>No Products</p>
            )}
        </div>
    )
}

export default AllProductsPage
