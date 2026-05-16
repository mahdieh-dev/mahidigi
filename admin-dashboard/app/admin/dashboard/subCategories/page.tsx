"use client"

import CreateSubCategory from '@/components/admin/dashboard/subCategories/create'
import ListAllSubCategories from '@/components/admin/dashboard/subCategories/list'
import { getAllSubCategoriesAndCategories } from '@/lib/database/actions/admin/subCategories/subCategories.actions'
import { useEffect, useState } from 'react'

const AdminSubCategoriesPage = () => {
    const [data, setData] = useState(null)
    const [categories, setCategories] = useState<any>()

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                await getAllSubCategoriesAndCategories().then(res => {
                    if (res.success) {
                        setData(res.subCategories)
                        setCategories(res.categories)
                    }
                }).catch(console.log)
            } catch (error: any) {
                console.log(error)
            }
        }
        fetchAllCategories()
    }, [])

    return (
        <div>
            <CreateSubCategory setSubCategories={setData} categories={categories} />
            <ListAllSubCategories
                subCategories={data}
                setSubCategories={setData}
                categories={categories}
            />
        </div>
    )
}

export default AdminSubCategoriesPage