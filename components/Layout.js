import Nav from "@/components/Nav"
import { useSession, signIn, signOut } from "next-auth/react"
import { useState } from "react"
import Logo from "./Logo"

export default function Layout({ children }) {

    const [showNav, setShowNav] = useState(false)

    const { data: session } = useSession()

    if (!session) {
        return (
            <>
                <div className="bg-bgGray w-screen h-screen flex items-center">
                    <div className='text-center w-full'>
                        <button onClick={() => signIn('google')} className='bg-slate-100 p-2 px-4 hover:bg-slate-300 rounded-md'>Login with Google</button>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <div className="bg-bgGray min-h-screen">
                <div className="block md:hidden flex items-center p-4">
                    <button onClick={() => setShowNav(!showNav)} >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path fill-rule="evenodd" d="M3 6.75A.75.75 0 0 1 3.75 6h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 6.75ZM3 12a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 12Zm0 5.25a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z" clip-rule="evenodd" />
                        </svg>
                    </button>
                    <div className="flex grow justify-center mr-6">
                        <Logo />
                    </div>
                </div>
                <div className="flex">
                    <Nav show={showNav} />
                    <div className="flex-grow p-4">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}