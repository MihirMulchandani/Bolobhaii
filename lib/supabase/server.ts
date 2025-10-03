import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL as string
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!supabaseUrl) throw new Error('SUPABASE_URL is not set')
if (!serviceKey) throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')

export const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  global: { fetch: fetch.bind(globalThis) },
})


