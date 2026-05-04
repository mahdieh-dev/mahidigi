import Image from "next/image"
import Link from "next/link"
import { MahiDevLogoIcon } from "./mahidev.logoIcon"


const Logo = () => {
    return (
        <div className="bg-transparent pl-12.5">
            <Link href={"/"} className="flex items-center gap-2.5">
                <MahiDevLogoIcon className="logo-icon block shrink-0" size={40} />
                <h2 className="text-center">
                    <span className="font-extrabold text-[25px] uppercase tracking-[1px]">
                        MAHIDIGI
                    </span>
                </h2>
            </Link>
        </div>
    )
}

export default Logo