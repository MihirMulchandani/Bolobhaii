"use client"
import Link from 'next/link'
import { useEffect, useState } from 'react'

function parseIdentity(): string | null {
  const m = document.cookie.split('; ').find(c => c.startsWith('bolo_identity_v1='))
  if (!m) return null
  const val = decodeURIComponent(m.split('=')[1])
  const [label] = val.split('|')
  return label || null
}

export default function Navbar() {
  const [identity, setIdentity] = useState<string | null>(null)
  const [theme, setTheme] = useState<string>('system')
  useEffect(() => {
    setIdentity(parseIdentity())
    const stored = localStorage.getItem('theme') || 'system'
    setTheme(stored)
    const root = document.documentElement
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = stored === 'dark' || (stored === 'system' && prefersDark)
    root.classList.toggle('dark', dark)
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = next === 'dark' || (next === 'system' && prefersDark)
    document.documentElement.classList.toggle('dark', dark)
  }

  return (
    <nav className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-gray-900/50 border-b border-gray-200/50 dark:border-gray-800">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/" className="font-semibold">BoloBhai</Link>
          <Link href="/feed" className="text-sm text-gray-600 dark:text-gray-300">Feed</Link>
          <Link href="/submit" className="text-sm text-gray-600 dark:text-gray-300">Submit</Link>
          <Link href="/leaderboard" className="text-sm text-gray-600 dark:text-gray-300">Top</Link>
          <Link href="/contact" className="text-sm text-gray-600 dark:text-gray-300">Contact</Link>
        </div>
        <div className="flex items-center gap-3">
          <button aria-label="Toggle theme" onClick={toggleTheme} className="rounded px-2 py-1 border text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
            {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'Auto'}
          </button>
          <span className="text-sm text-gray-700 dark:text-gray-300 hidden xs:inline">{identity ? `You are ${identity}` : '...'}</span>
        </div>
      </div>
    </nav>
  )
}


