import { defineEventHandler, getQuery } from 'h3'
import { pool } from '../utils/db'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { slug, category, limit = 10, page = 1 } = query
    
    let sql = 'SELECT * FROM articles'
    const params: any[] = []
    const conditions: string[] = []
    
    if (slug) {
      conditions.push(`slug = $${params.length + 1}`)
      params.push(slug)
    }
    
    if (category) {
      conditions.push(`category = $${params.length + 1}`)
      params.push(category)
    }
    
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ')
    }
    
    sql += ' ORDER BY date DESC'
    
    if (limit) {
      sql += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
      params.push(parseInt(limit as string), (parseInt(page as string) - 1) * parseInt(limit as string))
    }
    
    const result = await pool.query(sql, params)
    
    return {
      articles: result.rows,
      count: result.rowCount
    }
  } catch (error) {
    console.error('Database error:', error)
    return {
      error: 'Failed to fetch articles',
      details: (error as Error).message
    }
  }
})
