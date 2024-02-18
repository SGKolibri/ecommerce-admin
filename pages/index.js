import Layout from "@/components/Layout"
import { useSession } from "next-auth/react"

export default function Home() {

  const { data: session } = useSession()
  return (
    <>
      <Layout >
        <div className="flex justify-between">
          <h2>
            Hello, {session?.user?.name}
          </h2>
          <div className="flex bg-gray-200 gap-1 rounded-lg overflow-hidden">
            <img src={session?.user?.image} className='w-8 h-8' alt="" />
            <span className='py-1 px-2'>
              {session?.user?.name}
            </span>

          </div>
        </div>
      </Layout>
    </>
  )
}
