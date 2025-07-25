import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import SidebarLayout from '../components/SidebarLayout'
import { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)


  useEffect(() => {
    const getUser = async () => {
    const { data } = await supabase.auth.getSession()
const session = data?.session

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
    <SidebarLayout>
      <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
      <p className="mt-2">Logged in as: {user?.email}</p>
    </SidebarLayout>
  )
}
 