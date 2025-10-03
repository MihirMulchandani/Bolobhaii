import Navbar from '@/app/components/Navbar'
import { supabaseAdmin } from '@/lib/supabase/server'

async function getProfile(slug: string) {
  const { data } = await supabaseAdmin
    .from('confessions')
    .select('id, text, category, status, reactions_count, comments_count, created_at, identity')
    .eq('identity_slug', slug)
    .order('created_at', { ascending: false })
  return data || []
}

export default async function ProfilePage({ params }: { params: { slug: string } }) {
  const items = await getProfile(params.slug)
  const identity = items[0]?.identity || params.slug
  const totals = items.reduce((acc, it) => {
    acc.reactions += it.reactions_count || 0
    acc.comments += it.comments_count || 0
    return acc
  }, { reactions: 0, comments: 0 })
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="text-xl font-semibold">{identity}</h1>
        <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Total confessions: {items.length} · Reactions: {totals.reactions} · Comments: {totals.comments}</div>
        <ul className="mt-4 space-y-3">
          {items.map((c: any) => (
            <li key={c.id} className="rounded-lg border p-4">
              <div className="text-xs text-gray-500 flex items-center gap-2"><span className="rounded bg-gray-100 dark:bg-gray-700 px-2">{c.category}</span><span className="uppercase">{c.status}</span></div>
              <p className="mt-2">{c.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}


