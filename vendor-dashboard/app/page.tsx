"use client"

import Navbar from "@/components/navbar"
import { getVendorCookiesAndFetchVendor } from "@/lib/database/actions/vendor/vendor.actions"
import { useEffect, useState } from 'react'

const HomePage = () => {
  const [vendor, setVendor] = useState(null)

  useEffect(() => {
    try {
      const fetchVendorDetails = async () => {
        try {
          await getVendorCookiesAndFetchVendor().then(res => {
            if (res?.success) {
              setVendor(res?.vendor)
            }
          })
        } catch (error: any) {
          console.log(error)
        }
      }

      fetchVendorDetails()

    } catch (error: any) {
      console.log(error)
    }
  }, [])

  return (
    <div>
      <Navbar />
      {
        vendor && !vendor?.verified && (
          <div className="flex items-center justify-center bg-red-100 text-black">
            <b>Note:</b> You&apos;re not yet verified by an admin, so you don&apos;t have any access to Dashboard!!
          </div>
        )
      }
    </div>
  )
}

export default HomePage
