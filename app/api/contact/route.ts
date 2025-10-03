import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()
    if (!message || typeof message !== 'string') return NextResponse.json({ error: 'message required' }, { status: 400 })
    const { error } = await supabaseAdmin.from('contacts').insert({ name: name || null, email: email || null, message })
    if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


