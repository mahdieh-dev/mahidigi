"use client"

import CreateOffer from '@/components/admin/dashboard/offers/create'
import ListAllOffers from '@/components/admin/dashboard/offers/list'
import { getAllOffers } from '@/lib/database/actions/admin/offers/offers.action'
import { useEffect, useState } from 'react'

function HomeScreenOffers() {
    const [data, setData] = useState([])

    useEffect(() => {
        const fetchAllOffers = async () => {
            try {
                await getAllOffers().then(res => {
                    if (res.success) {
                        setData(res.offers)
                    } else {
                        alert(res.message)
                    }
                    console.log(res)
                })
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllOffers()
    }, [])

    return (
        <div>
            <CreateOffer setOffers={setData} />
            <ListAllOffers offers={data} setOffers={setData} />
        </div>
    )
}

export default HomeScreenOffers
