import { Button } from "@mantine/core"
import { useRouter } from "next/navigation"
import Logo from "./logo"

const Navbar = () => {
    const router = useRouter()

    return (
        <header className="p-4 border-b border-b-[#eaeaea]">
            <nav className="flex justify-between items-center">
                <Logo />
                <Button variant="outline" onClick={() => router.push("/admin/dashboard")}>
                    Admin Dashboard
                </Button>
            </nav>
        </header>
    )
}

export default Navbar