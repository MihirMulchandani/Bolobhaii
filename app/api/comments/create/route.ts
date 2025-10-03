import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getOrCreateIdentity } from '@/lib/identity'
import { validateCommentInput } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valid, errors, confession_id, text } = validateCommentInput(body)
    if (!valid) return NextResponse.json({ errors }, { status: 400 })
    const identity = getOrCreateIdentity()

    const { error } = await supabaseAdmin.rpc('increment_comments_and_insert', {
      p_confession_id: confession_id,
      p_text: text,
      p_identity: identity.label,
      p_identity_slug: identity.slug,
    })

    if (error) {
      // Fallback if rpc not present: do manual insert + update
      const { error: insertError } = await supabaseAdmin.from('comments').insert({
        confession_id,
        text,
        identity: identity.label,
        identity_slug: identity.slug,
      })
      if (insertError) throw insertError
      const { error: updateError } = await supabaseAdmin.rpc('increment_column', { table_name: 'confessions', col: 'comments_count', row_id: confession_id })
      if (updateError) {
        await supabaseAdmin.from('confessions').update({ comments_count: (undefined as unknown) as number }).eq('id', confession_id)
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}



