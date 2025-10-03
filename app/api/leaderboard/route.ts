import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const limit = Math.max(1, Math.min(50, parseInt(url.searchParams.get('limit') || '10', 10)))

    const { data, error } = await supabaseAdmin
      .from('confessions')
      .select('id, text, category, identity, identity_slug, reactions_count, comments_count, created_at')
      .eq('status', 'accepted')
      .order('reactions_count', { ascending: false })
      .order('comments_count', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Note: Ideally compute (reactions + comments) in SQL. Here we sort again to ensure desc by sum.
    const items = (data || []).sort((a, b) => (b.reactions_count + b.comments_count) - (a.reactions_count + a.comments_count))
    return NextResponse.json({ items })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


