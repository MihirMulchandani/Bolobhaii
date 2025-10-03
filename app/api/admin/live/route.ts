import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/adminSession'

export const runtime = 'nodejs'

export async function GET() {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await supabaseAdmin
    .from('confessions')
    .select('id, text, category, identity, identity_slug, reactions_count, comments_count, created_at')
    .eq('status', 'accepted')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  return NextResponse.json({ items: data })
}


