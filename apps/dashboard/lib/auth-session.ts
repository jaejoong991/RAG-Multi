export async function createSession(idToken: string): Promise<void> {
  await fetch('/api/auth/session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ idToken }),
  })
}

export async function deleteSession(): Promise<void> {
  await fetch('/api/auth/session', { method: 'DELETE' })
}
