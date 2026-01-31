import { defineEventHandler, getQuery } from 'h3'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { slug } = query
    
    if (!slug) {
      return {
        error: 'Slug parameter is required'
      }
    }
    
    const result = await pool.query(
      'SELECT * FROM articles WHERE slug = $1',
      [slug]
    )
    
    if (result.rows.length === 0) {
      return {
        error: 'Article not found'
      }
    }
    
    return {
      article: result.rows[0]
    }
  } catch (error) {
    console.error('Database error:', error)
    return {
      error: 'Failed to fetch article',
      details: (error as Error).message
    }
  }
})
