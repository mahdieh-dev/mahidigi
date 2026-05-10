"use client"

import CreateSubCategory from '@/components/vendor/dashboard/subCategories/create'
import ListAllSubCategories from '@/components/vendor/dashboard/subCategories/list'
import { getAllSubCategoriesAndCategories } from '@/lib/database/actions/vendor/subCategories/subCategories.actions'
import { useEffect, useState } from 'react'

const VendorSubCategoriesPage = () => {
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

export default VendorSubCategoriesPage