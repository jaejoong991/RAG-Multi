import { createCipheriv, createDecipheriv, randomBytes } from 'node:crypto'
import { env } from '../../config/env'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12  // 96-bit IV recommended for GCM
const AUTH_TAG_LENGTH = 16
const ENCODING = 'hex' as const

function getKeyBuffer(): Buffer {
  return Buffer.from(env.ENCRYPTION_KEY, ENCODING)
}

export function encryptApiKey(plaintext: string): string {
  const iv = randomBytes(IV_LENGTH)
  const key = getKeyBuffer()
  const cipher = createCipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })

  const encrypted = Buffer.concat([
    cipher.update(plaintext, 'utf8'),
    cipher.final(),
  ])
  const authTag = cipher.getAuthTag()

  // Format: iv:authTag:ciphertext (all hex)
  return [iv.toString(ENCODING), authTag.toString(ENCODING), encrypted.toString(ENCODING)].join(':')
}

export function decryptApiKey(enc: string): string {
  const parts = enc.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted key format')
  }

  const [ivHex, authTagHex, ciphertextHex] = parts
  const iv = Buffer.from(ivHex, ENCODING)
  const authTag = Buffer.from(authTagHex, ENCODING)
  const ciphertext = Buffer.from(ciphertextHex, ENCODING)
  const key = getKeyBuffer()

  const decipher = createDecipheriv(ALGORITHM, key, iv, { authTagLength: AUTH_TAG_LENGTH })
  decipher.setAuthTag(authTag)

  return Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]).toString('utf8')
}
