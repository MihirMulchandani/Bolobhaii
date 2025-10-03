import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getOrCreateIdentity } from '@/lib/identity'
import { validateReactionInput } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valid, errors, confession_id, emoji } = validateReactionInput(body)
    if (!valid) return NextResponse.json({ errors }, { status: 400 })
    const identity = getOrCreateIdentity()

    // Prevent duplicate reaction by same identity and emoji
    const { data: existing, error: selectErr } = await supabaseAdmin
      .from('reactions')
      .select('id')
      .eq('confession_id', confession_id)
      .eq('identity_slug', identity.slug)
      .eq('emoji', emoji)
      .maybeSingle()

    if (selectErr) throw selectErr
    if (existing) return NextResponse.json({ ok: true, duplicate: true })

    const { error: insertErr } = await supabaseAdmin.from('reactions').insert({
      confession_id,
      emoji,
      identity: identity.label,
      identity_slug: identity.slug,
    })
    if (insertErr) throw insertErr

    await supabaseAdmin.rpc('increment_column', { table_name: 'confessions', col: 'reactions_count', row_id: confession_id })

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


