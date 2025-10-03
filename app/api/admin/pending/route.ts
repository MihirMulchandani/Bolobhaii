import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/adminSession'

export const runtime = 'nodejs'

export async function GET() {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin
    .from('confessions')
    .select('id, text, category, identity, identity_slug, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: true })
  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json({ items: data })
}


