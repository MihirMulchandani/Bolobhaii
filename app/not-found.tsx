import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto max-w-md p-6 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="mt-2 text-gray-600">Go back to the feed and keep exploring.</p>
      <Link className="mt-4 inline-block rounded bg-brand-600 text-white px-4 py-2" href="/feed">Go to Feed</Link>
    </main>
  )
}


