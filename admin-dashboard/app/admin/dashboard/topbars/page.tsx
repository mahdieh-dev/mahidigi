"use client"

import CreateTopBar from '@/components/admin/dashboard/topbars/create'
import ListAllTopBars from '@/components/admin/dashboard/topbars/list'
import { getAllTopBars } from '@/lib/database/actions/admin/topbar/topbar.actions'
import { useEffect, useState } from 'react'

function TopBarPage() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchAllTabBars = async () => {
            try {
                await getAllTopBars().then(res => {
                    if (res.success) {
                        setData(res.topBars)
                    } else {
                        alert(res.message)
                        console.log(res)
                    }
                })
            } catch (error) {
                console.log(error)
            }
        }

        fetchAllTabBars()
    }, [])

    return (
        <div className='container'>
            <CreateTopBar setTopBars={setData} />
            <ListAllTopBars topBars={data} setTopBars={setData} />
        </div>
    )
}

export default TopBarPage
