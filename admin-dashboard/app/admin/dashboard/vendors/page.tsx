"use client"

import EnhancedTableVendors from '@/components/admin/dashboard/vendors/table'
import { getAllVendors } from '@/lib/database/actions/admin/vendor.actions'
import { useEffect, useState } from 'react'

function AllVendorsPage() {
    const [vendors, setVendors] = useState()

    useEffect(() => {
        const fetchAllVendors = async () => {
            try {
                getAllVendors().then(res => {
                    if (res) {
                        setVendors(res)
                    }
                }).catch(console.log)
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllVendors()
    }, [])

    return (
        <div className='container'>
            <EnhancedTableVendors rows={vendors} />
        </div>
    )
}

export default AllVendorsPage
