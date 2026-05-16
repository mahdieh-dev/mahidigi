"use client"

import ProductsDataTable from '@/components/admin/dashboard/products/data.products.table'
import { getAllProducts } from '@/lib/database/actions/admin/products/products.actions'
import { useEffect, useState } from 'react'

function AllProductsPage() {
    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        async function fetchAllProducts() {
            try {
                await getAllProducts().then(res => {
                    setProducts(res)
                }).catch(console.log)
            } catch (error) {
                console.log(error)
                alert(error)
            }
        }

        fetchAllProducts()
    }, [])

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
