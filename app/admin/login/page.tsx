"use client"
import Navbar from '@/app/components/Navbar'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const router = useRouter()
  async function login() {
    setMsg('')
    const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    const data = await res.json()
    if (!res.ok) { setMsg(data?.error || 'Error'); return }
    router.push('/admin/dashboard')
  }
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-sm p-4">
        <h1 className="text-xl font-semibold mb-3">Admin Login</h1>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="Username" className="w-full rounded border p-2 mb-2" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" className="w-full rounded border p-2 mb-2" />
        <button onClick={login} className="w-full rounded bg-brand-600 text-white py-2">Login</button>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </div>
    </main>
  )
}


