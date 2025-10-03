import Navbar from '@/components/Navbar'

async function getLeaderboard() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/leaderboard?limit=20`, { cache: 'no-store' })
  if (!res.ok) return { items: [] }
  return res.json()
}

export default async function LeaderboardPage() {
  const data = await getLeaderboard()
  return (
    <main>
      <Navbar />
      <div className="mx-auto max-w-2xl p-4">
        <h1 className="text-xl font-semibold mb-3">Leaderboard</h1>
        <ol className="space-y-3">
          {data.items?.map((c: any, i: number) => (
            <li key={c.id} className="rounded-lg border p-4">
              <div className="text-xs text-gray-500">#{i+1} · {c.category}</div>
              <p className="mt-2">{c.text}</p>
              <div className="mt-2 text-xs text-gray-600">Score: {c.reactions_count + c.comments_count}</div>
            </li>
          ))}
        </ol>
      </div>
    </main>
  )
}


