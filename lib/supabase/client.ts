import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

if (!supabaseUrl) throw new Error('NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL is not set')
if (!anonKey) throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY is not set')

export const supabase = createClient(supabaseUrl, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})


