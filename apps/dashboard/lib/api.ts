import { auth } from './firebase'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'

async function getAuthHeader(): Promise<HeadersInit> {
  const token = await auth.currentUser?.getIdToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_BASE_URL}${path}`, { headers })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<T>
}

export async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const headers = await getAuthHeader()
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error ${res.status}`)
  return res.json() as Promise<T>
}

export async function apiDelete(path: string): Promise<void> {
  const headers = await getAuthHeader()
  await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE', headers })
}
