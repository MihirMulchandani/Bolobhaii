import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10))
    const size = Math.min(50, Math.max(1, parseInt(url.searchParams.get('size') || '10', 10)))
    const from = (page - 1) * size
    const to = from + size - 1

    const { data, error } = await supabaseAdmin
      .from('confessions')
      .select('id, text, category, identity, identity_slug, reactions_count, comments_count, created_at')
      .eq('status', 'accepted')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) throw error
    return NextResponse.json({ page, size, items: data })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


