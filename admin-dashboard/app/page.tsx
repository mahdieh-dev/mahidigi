"use client"

import Navbar from "@/components/navbar"

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center bg-red-100 text-black">
        Welcome admin!
      </div>
    </div>
  )
}

export default HomePage
