import Navbar from '@/app/components/Navbar'
import Link from 'next/link'

async function getFeed(page: number, size: number) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/confessions/feed?page=${page}&size=${size}`, { cache: 'no-store' })
  if (!res.ok) return { items: [] }
  return res.json()
}

export default async function FeedPage({ searchParams }: { searchParams?: { page?: string } }) {
  const page = Number(searchParams?.page || '1')
  const size = 10
  const data = await getFeed(page, size)
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="text-xl font-semibold mb-3">Feed</h1>
        <ul className="space-y-3">
          {data.items?.map((c: any) => (
            <li key={c.id} className="rounded-lg border p-4 bg-white/80 dark:bg-gray-800/60">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="rounded bg-gray-100 dark:bg-gray-700 px-2 py-0.5">{c.category}</span>
                <span>{new Date(c.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-2 whitespace-pre-wrap">{c.text}</p>
              <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 flex gap-3">
                <span>❤️ {c.reactions_count}</span>
                <span>💬 {c.comments_count}</span>
                <Link className="underline" href={`/profile/${c.identity_slug}`}>{c.identity}</Link>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex items-center justify-between">
          {page > 1 ? <Link href={`/feed?page=${page-1}`} className="underline">Prev</Link> : <span />}
          <Link href={`/feed?page=${page+1}`} className="underline">Next</Link>
        </div>
      </div>
    </main>
  )
}


