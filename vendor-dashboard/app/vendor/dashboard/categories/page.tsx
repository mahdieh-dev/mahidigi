"use client"

import CreateCategory from '@/components/vendor/dashboard/categories/create'
import ListAllCategories from '@/components/vendor/dashboard/categories/list'
import { getAllCategories } from '@/lib/database/actions/vendor/category/category.actions'
import React, { useEffect, useState } from 'react'

const VendorCategories = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        async function fetchAllCategories() {
            await getAllCategories().then(setData).catch(console.log)
        }
        fetchAllCategories()
    }, [])

    return (
        <div>
            <CreateCategory setCategories={setData} />
            <ListAllCategories setCategories={setData} categories={data} />
        </div>
    )
}

export default VendorCategories