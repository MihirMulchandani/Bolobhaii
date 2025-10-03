import { NextResponse } from 'next/server'
import { setAdminSession } from '@/lib/adminSession'

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const u = process.env.ADMIN_USER
    const p = process.env.ADMIN_PASSWORD
    if (!u || !p) return NextResponse.json({ error: 'Admin not configured' }, { status: 500 })
    if (username !== u || password !== p) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    setAdminSession(username)
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


