export const CATEGORIES = ['spicy','romantic','funny','shocking','random'] as const
export type Category = typeof CATEGORIES[number]

export function isValidCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value)
}

export function validateConfessionInput(input: { text: unknown; category: unknown }) {
  const errors: string[] = []
  const text = typeof input.text === 'string' ? input.text.trim() : ''
  const category = typeof input.category === 'string' ? input.category : ''
  if (text.length < 10 || text.length > 1000) errors.push('Text must be 10-1000 characters')
  if (!isValidCategory(category)) errors.push('Invalid category')
  return { valid: errors.length === 0, errors, text, category: category as Category }
}

export function validateCommentInput(input: { confession_id: unknown; text: unknown }) {
  const errors: string[] = []
  const confession_id = typeof input.confession_id === 'string' ? input.confession_id : ''
  const text = typeof input.text === 'string' ? input.text.trim() : ''
  if (!confession_id) errors.push('confession_id required')
  if (text.length < 1 || text.length > 500) errors.push('Text must be 1-500 characters')
  return { valid: errors.length === 0, errors, confession_id, text }
}

export function validateReactionInput(input: { confession_id: unknown; emoji: unknown }) {
  const errors: string[] = []
  const confession_id = typeof input.confession_id === 'string' ? input.confession_id : ''
  const emoji = typeof input.emoji === 'string' ? input.emoji : ''
  if (!confession_id) errors.push('confession_id required')
  if (!emoji) errors.push('emoji required')
  return { valid: errors.length === 0, errors, confession_id, emoji }
}

export function getClientIp(headers: Headers): string | null {
  const fwd = headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  const realIp = headers.get('x-real-ip')
  if (realIp) return realIp
  return null
}


