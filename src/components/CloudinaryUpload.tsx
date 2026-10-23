'use client'

import { useState } from 'react'

interface Props {
  onUpload: (url: string) => void
  type?: 'image' | 'video'
  label?: string
}

export default function CloudinaryUpload({ onUpload, type = 'image', label }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')

    const maxSize = type === 'video' ? 50 * 1024 * 1024 : 5 * 1024 * 1024
    if (file.size > maxSize) {
      setError(`File too large. Max ${type === 'video' ? '50MB' : '5MB'}.`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const res = await fetch('/api/upload', { method: 'POST', body: formData })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')

      onUpload(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 'bold', marginBottom: 6 }}>
        {label || (type === 'video' ? 'Upload video' : 'Upload image')}
      </label>
      <input
        type="file"
        accept={type === 'video' ? 'video/*' : 'image/*'}
        onChange={handleChange}
        disabled={uploading}
        style={{ fontSize: 13 }}
      />
      {uploading && <p style={{ fontSize: 12, color: '#737873', margin: '6px 0 0' }}>Uploading…</p>}
      {error && <p style={{ fontSize: 12, color: '#b3261e', margin: '6px 0 0' }}>{error}</p>}
    </div>
  )
}
