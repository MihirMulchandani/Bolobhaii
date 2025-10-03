import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl p-6">
      <section className="rounded-xl bg-white/70 dark:bg-gray-800/60 backdrop-blur shadow-md p-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">BoloBhai</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">Say it. Secretly. Safely.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link className="rounded-lg bg-brand-600 px-4 py-2 text-white hover:bg-brand-700 transition" href="/feed">Go to Feed</Link>
          <Link className="rounded-lg border px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition" href="/submit">Submit Confession</Link>
        </div>
      </section>
    </main>
  )
}


