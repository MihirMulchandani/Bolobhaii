"use client"
import Navbar from '@/app/components/Navbar'
import { useState } from 'react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [info, setInfo] = useState('')

  async function submit() {
    setInfo('')
    const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, message }) })
    const data = await res.json()
    if (!res.ok) { setInfo(data?.error || 'Error'); return }
    setInfo('Message sent!')
    setName(''); setEmail(''); setMessage('')
  }

  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-md p-4">
        <h1 className="text-xl font-semibold mb-3">Contact</h1>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name" className="w-full rounded border p-2 mb-2" />
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded border p-2 mb-2" />
        <textarea value={message} onChange={e=>setMessage(e.target.value)} placeholder="Message" rows={5} className="w-full rounded border p-2 mb-2" />
        <button onClick={submit} className="w-full rounded bg-brand-600 text-white py-2">Send</button>
        {info && <p className="mt-3 text-sm">{info}</p>}
      </div>
    </main>
  )
}


