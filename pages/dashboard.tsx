import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  import { User } from '@supabase/supabase-js'
const [user, setUser] = useState<User | null>(null)


  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session?.user) {
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    }

    getUser()
  }, [router])

  if (loading) return <div className="p-6">Checking login status...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
      <p className="mt-2">Logged in as: {user.email}</p>
    </div>
  )
}
<button
  onClick={async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }}
  className="mt-4 bg-red-600 text-white px-4 py-2"
>
  Log Out
</button>
