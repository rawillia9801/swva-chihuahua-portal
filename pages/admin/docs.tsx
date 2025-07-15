import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import SidebarLayout from '../../components/SidebarLayout'


export default function AdminDocsUpload() {
  const [userId, setUserId] = useState('')
  const [title, setTitle] = useState('')
  const [status, setStatus] = useState('Submitted')
  const [file, setFile] = useState<File | null>(null)
  const [message, setMessage] = useState('')

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || !userId || !title) {
      setMessage('Missing required fields.')
      return
    }

    const filename = `${Date.now()}_${file.name}`
    const { data, error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filename, file)

    if (uploadError) {
      setMessage(`Upload error: ${uploadError.message}`)
      return
    }

    const url = supabase.storage.from('documents').getPublicUrl(filename).data.publicUrl

    const { error: insertError } = await supabase.from('documents').insert([
      {
        user_id: userId,
        title,
        url,
        status,
      },
    ])

    if (insertError) {
      setMessage(`DB insert error: ${insertError.message}`)
      return
    }

    setMessage('Document uploaded successfully.')
    setFile(null)
    setTitle('')
    setUserId('')
    setStatus('Submitted')
  }

  return (
    <SidebarLayout>
      <h1 className="text-2xl font-bold mb-4">Upload Document for User</h1>
      <form onSubmit={handleUpload} className="space-y-4 max-w-md">
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full p-2 border"
        />
        <input
          type="text"
          placeholder="Title (e.g., Bill of Sale)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border"
        >
          <option value="Submitted">Submitted</option>
          <option value="Signed">Signed</option>
          <option value="Approved">Approved</option>
        </select>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full p-2"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2">
          Upload
        </button>
        {message && <p className="text-sm mt-2 text-blue-700">{message}</p>}
      </form>
    </SidebarLayout>
  )
}
