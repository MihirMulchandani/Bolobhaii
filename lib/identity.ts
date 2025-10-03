import { cookies } from 'next/headers'

const COLORS = ['Blue','Pink','Mint','Violet','Amber','Teal','Lime','Indigo','Coral','Ruby']
const ANIMALS = ['Fox','Panda','Tiger','Otter','Koala','Wolf','Hawk','Dolphin','Cat','Dog']
const EMOJIS = ['🦊','🐼','🐯','🦦','🐨','🐺','🦅','🐬','🐱','🐶']

export type Identity = {
  label: string
  slug: string
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function slugify(parts: string[]): string {
  const base = parts.join('-').toLowerCase().replace(/[^a-z0-9-]/g, '-')
  const rand = Math.floor(100 + Math.random() * 900)
  return `${base}-${rand}`
}

export const IDENTITY_COOKIE = 'bolo_identity_v1'

export function getOrCreateIdentity(): Identity {
  const store = cookies()
  const existing = store.get(IDENTITY_COOKIE)
  if (existing?.value) {
    const [label, slug] = decodeURIComponent(existing.value).split('|')
    if (label && slug) return { label, slug }
  }
  const color = randomFrom(COLORS)
  const animal = randomFrom(ANIMALS)
  const emoji = randomFrom(EMOJIS)
  const label = `${color} ${animal} ${emoji}`
  const slug = slugify([color, animal])
  const value = encodeURIComponent(`${label}|${slug}`)
  store.set(IDENTITY_COOKIE, value, {
    httpOnly: false,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 12 months approx
  })
  return { label, slug }
}

export function readIdentity(): Identity | null {
  const store = cookies()
  const existing = store.get(IDENTITY_COOKIE)
  if (!existing?.value) return null
  const [label, slug] = decodeURIComponent(existing.value).split('|')
  if (label && slug) return { label, slug }
  return null
}


