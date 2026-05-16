"use client"

import CreateCategory from '@/components/admin/dashboard/categories/create'
import ListAllCategories from '@/components/admin/dashboard/categories/list'
import { getAllCategories } from '@/lib/database/actions/admin/category/category.actions'
import { useEffect, useState } from 'react'

const AdminCategories = () => {
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

export default AdminCategories