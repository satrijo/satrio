import { defineEventHandler, getQuery } from 'h3'
import { pool } from '../utils/db'

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
