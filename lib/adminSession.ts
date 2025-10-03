import { cookies } from 'next/headers'
import crypto from 'crypto'

const ADMIN_COOKIE = 'bolo_admin_session'

function sign(data: string, secret: string) {
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

export function setAdminSession(username: string) {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET not set')
  const ts = Date.now().toString()
  const payload = `${username}|${ts}`
  const sig = sign(payload, secret)
  const value = encodeURIComponent(`${payload}|${sig}`)
  cookies().set(ADMIN_COOKIE, value, {
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 8, // 8 hours
  })
}

export function requireAdmin(): { user: string } | null {
  const secret = process.env.JWT_SECRET
  if (!secret) return null
  const c = cookies().get(ADMIN_COOKIE)?.value
  if (!c) return null
  const decoded = decodeURIComponent(c)
  const [user, ts, sig] = decoded.split('|')
  if (!user || !ts || !sig) return null
  const expected = sign(`${user}|${ts}`, secret)
  if (expected !== sig) return null
  return { user }
}


