import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { getOrCreateIdentity } from '@/lib/identity'
import { checkRateLimit } from '@/lib/rateLimit'
import { getClientIp, validateConfessionInput } from '@/lib/validation'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { valid, errors, text, category } = validateConfessionInput(body)
    if (!valid) return NextResponse.json({ errors }, { status: 400 })

    const identity = getOrCreateIdentity()
    const ip = getClientIp(request.headers) || '0.0.0.0'
    const rateKey = `create:${identity.slug}:${ip}`
    const { allowed, retryAfterMs } = checkRateLimit(rateKey, 30_000)
    if (!allowed) return NextResponse.json({ error: 'Rate limit', retryAfterMs }, { status: 429 })

    const { data, error } = await supabaseAdmin
      .from('confessions')
      .insert({ text, category, identity: identity.label, identity_slug: identity.slug, ip, status: 'pending' })
      .select('id, status')
      .single()

    if (error) throw error
    return NextResponse.json({ id: data.id, status: data.status })
  } catch (err: any) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}


