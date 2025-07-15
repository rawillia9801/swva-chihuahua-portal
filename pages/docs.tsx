import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import SidebarLayout from '../components/SidebarLayout'

type Doc = {
  id: string
  title: string
  url: string
  status: string
  created_at: string
}

export default function DocsPage() {
  const [docs, setDocs] = useState<Doc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDocs = async () => {
      const { data: sessionData } = await supabase.auth.getSession()
      const user = sessionData.session?.user
      if (!user) return

      const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching documents:', error.message)
        return
      }

      setDocs(data || [])
      setLoading(false)
    }

    fetchDocs()
  }, [])

  return (
    <SidebarLayout>
      <h1 className="text-2xl font-bold mb-4">Your Documents</h1>
      {loading ? (
        <p>Loading...</p>
      ) : docs.length === 0 ? (
        <p>No documents uploaded yet.</p>
      ) : (
        <ul className="space-y-4">
          {docs.map((doc) => (
            <li key={doc.id} className="border p-4 rounded-md">
              <h2 className="text-lg font-semibold">{doc.title}</h2>
              <p className="text-sm text-gray-600 mb-2">Status: {doc.status}</p>
              <a
                href={doc.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View Document
              </a>
            </li>
          ))}
        </ul>
      )}
    </SidebarLayout>
  )
}
