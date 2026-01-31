import { defineEventHandler, getQuery } from 'h3'
import { pool } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { slug, limit = 5 } = query
    
    if (!slug) {
      return { error: 'Slug parameter is required' }
    }
    
    const currentResult = await pool.query(
      'SELECT category, programming_language FROM articles WHERE slug = $1',
      [slug]
    )
    
    if (currentResult.rows.length === 0) {
      return { articles: [] }
    }
    
    const { category, programming_language } = currentResult.rows[0]
    
    const relatedResult = await pool.query(
      `SELECT slug, title, category, date, programming_language
       FROM articles 
       WHERE slug != $1 
         AND (category = $2 OR programming_language = $3)
       ORDER BY date DESC
       LIMIT $4`,
      [slug, category, programming_language, parseInt(limit as string)]
    )
    
    // Transform to include path field for component compatibility
    const articles = relatedResult.rows.map(article => ({
      ...article,
      path: `/blog/${article.slug}`
    }))
    
    return { articles }
  } catch (error) {
    console.error('Database error:', error)
    return {
      error: 'Failed to fetch related articles',
      details: (error as Error).message
    }
  }
})
