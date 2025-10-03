import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/server'
import { requireAdmin } from '@/lib/adminSession'

export const runtime = 'nodejs'

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const admin = requireAdmin()
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { error } = await supabaseAdmin.from('confessions').update({ status: 'rejected' }).eq('id', params.id)
  if (error) return NextResponse.json({ error: 'Server error' }, { status: 500 })
  await supabaseAdmin.from('admin_audit').insert({ admin_user: admin.user, action: 'reject', target_id: params.id })
  return NextResponse.json({ ok: true })
}


