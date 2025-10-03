import Navbar from '@/components/Navbar'

async function getPending() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/pending`, { cache: 'no-store' })
  if (!res.ok) return { items: [] }
  return res.json()
}

async function getLive() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/admin/live`, { cache: 'no-store' })
  if (!res.ok) return { items: [] }
  return res.json()
}

async function act(path: string) {
  'use server'
  await fetch(path, { method: 'POST' })
}

export default async function AdminDashboard() {
  const [pending, live] = await Promise.all([getPending(), getLive()])
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-4xl p-4 grid gap-6 md:grid-cols-2">
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


