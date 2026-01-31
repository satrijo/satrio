import { Pool } from 'pg'

// Singleton pattern using globalThis
declare global {
  var __pg_pool__: Pool | undefined
}

if (!globalThis.__pg_pool__) {
  globalThis.__pg_pool__ = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
  })
}

export const pool = globalThis.__pg_pool__
