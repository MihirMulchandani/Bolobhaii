import Navbar from '@/components/Navbar'
import { cookies } from 'next/headers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function getCookieHeader(): string | undefined {
  const all = cookies().getAll()
  if (!all.length) return undefined
  return all.map(c => `${c.name}=${c.value}`).join('; ')
}

async function getPending() {
  const cookieHeader = getCookieHeader()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/pending`, { cache: 'no-store', headers: cookieHeader ? { cookie: cookieHeader } : {} })
  if (res.status === 401) return { unauthorized: true }
  if (!res.ok) return { items: [] }
  return res.json()
}

async function getLive() {
  const cookieHeader = getCookieHeader()
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/live`, { cache: 'no-store', headers: cookieHeader ? { cookie: cookieHeader } : {} })
  if (res.status === 401) return { unauthorized: true }
  if (!res.ok) return { items: [] }
  return res.json()
}

async function act(path: string) {
  'use server'
  const cookieHeader = getCookieHeader()
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}${path}`, { method: 'POST', headers: cookieHeader ? { cookie: cookieHeader } : {} })
}

export default async function AdminDashboard() {
  const [pending, live] = await Promise.all([getPending(), getLive()])
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl p-4 grid gap-6 md:grid-cols-2">
        {(pending as any)?.unauthorized || (live as any)?.unauthorized ? (
          <div className="md:col-span-2 rounded border p-3">
            <p className="text-sm">You must be logged in as admin. Please go to <a className="underline" href="/admin/login">/admin/login</a> and sign in.</p>
          </div>
        ) : null}
        <section>
          <h2 className="font-semibold">Pending</h2>
          <ul className="mt-2 space-y-3">
            {pending.items?.map((c: any) => (
              <li key={c.id} className="rounded border p-3">
                <p>{c.text}</p>
                <div className="mt-2 flex gap-2">
                  <form action={async () => { await act(`/api/admin/confessions/${c.id}/accept`) }}><button className="rounded bg-green-600 text-white px-2 py-1">Accept</button></form>
                  <form action={async () => { await act(`/api/admin/confessions/${c.id}/reject`) }}><button className="rounded bg-yellow-600 text-white px-2 py-1">Reject</button></form>
                  <form action={async () => { await act(`/api/admin/confessions/${c.id}/remove`) }}><button className="rounded bg-red-600 text-white px-2 py-1">Remove</button></form>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h2 className="font-semibold">Live</h2>
          <ul className="mt-2 space-y-3">
            {live.items?.map((c: any) => (
              <li key={c.id} className="rounded border p-3">
                <p>{c.text}</p>
                <div className="mt-1 text-xs text-gray-600">❤️ {c.reactions_count} · 💬 {c.comments_count}</div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}


