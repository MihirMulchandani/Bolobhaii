"use client"
import Navbar from '@/app/components/Navbar'
import { useEffect, useState } from 'react'

export default function SubmitPage() {
  const [text, setText] = useState('')
  const [category, setCategory] = useState('spicy')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  const len = text.trim().length

  async function submit() {
    setPending(true)
    setMessage('')
    const res = await fetch('/api/confessions/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, category }) })
    const data = await res.json()
    setPending(false)
    if (!res.ok) { setMessage(data?.errors?.join(', ') || data?.error || 'Error'); return }
    setMessage(`Submitted! ID: ${data.id} (pending moderation)`) 
    setText('')
  }

  const disabled = pending || len < 10 || len > 1000

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-xl font-semibold mb-3">Submit Confession</h1>
        <label className="block text-sm mb-1">Category</label>
        <select value={category} onChange={e => setCategory(e.target.value)} className="w-full rounded border p-2 mb-3">
          {['spicy','romantic','funny','shocking','random'].map(c => <option key={c}>{c}</option>)}
        </select>
        <label className="block text-sm mb-1">Text</label>
        <textarea value={text} onChange={e => setText(e.target.value)} rows={6} className="w-full rounded border p-2" />
        <div className="mt-1 text-xs text-gray-600">{len}/1000</div>
        <button disabled={disabled} onClick={submit} className="mt-3 w-full rounded bg-brand-600 text-white py-2 disabled:opacity-50">Submit</button>
        {message && <p className="mt-3 text-sm">{message}</p>}
      </div>
    </main>
  )
}


