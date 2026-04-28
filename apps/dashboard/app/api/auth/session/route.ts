import { NextRequest, NextResponse } from 'next/server'
import * as admin from 'firebase-admin'

const SESSION_COOKIE_NAME = '__session'
const SESSION_DURATION_MS = 5 * 24 * 60 * 60 * 1000 // 5 days

function getAdminApp(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App
  }

  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')

  return admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  })
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body: unknown = await request.json()

  if (
    typeof body !== 'object' ||
    body === null ||
    !('idToken' in body) ||
    typeof (body as Record<string, unknown>).idToken !== 'string'
  ) {
    return NextResponse.json({ error: 'Missing or invalid idToken' }, { status: 400 })
  }

  const idToken = (body as { idToken: string }).idToken

  try {
    const app = getAdminApp()
    const sessionCookie = await admin.auth(app).createSessionCookie(idToken, {
      expiresIn: SESSION_DURATION_MS,
    })

    const response = NextResponse.json({ success: true })
    response.cookies.set(SESSION_COOKIE_NAME, sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION_MS / 1000,
      path: '/',
    })

    return response
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create session'
    return NextResponse.json({ error: message }, { status: 401 })
  }
}

export async function DELETE(): Promise<NextResponse> {
  const response = NextResponse.json({ success: true })
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
  return response
}
