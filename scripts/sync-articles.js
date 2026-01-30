#!/usr/bin/env node
/**
 * Sync markdown articles to PostgreSQL
 * Handles: CREATE, UPDATE, DELETE
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const matter = require('gray-matter');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const CONTENT_DIR = path.join(__dirname, '../content/blog');

async function initSchema() {
  console.log('🔧 Checking database schema...');
  
  const schemaSQL = `
    CREATE TABLE IF NOT EXISTS articles (
      id SERIAL PRIMARY KEY,
      slug VARCHAR(255) UNIQUE NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      content TEXT NOT NULL,
      category VARCHAR(100),
      article_language VARCHAR(50),
      ai_generated VARCHAR(50),
      programming_language VARCHAR(100),
      date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    
    CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
    CREATE INDEX IF NOT EXISTS idx_articles_date ON articles(date DESC);
    CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
  `;
  
  try {
    await pool.query(schemaSQL);
    console.log('✅ Schema ready');
  } catch (error) {
    console.error('❌ Schema error:', error);
    throw error;
  }
}

async function syncArticles() {
  console.log('🔄 Syncing articles to PostgreSQL...');
  
  try {
    // 1. Get all markdown files
    const files = fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.md'));
    
    console.log(`📄 Found ${files.length} markdown files`);
    
    // 2. Get current slugs from database
    const currentResult = await pool.query('SELECT slug FROM articles');
    const currentSlugs = new Set(currentResult.rows.map(r => r.slug));
    const newSlugs = new Set();
    
    // 3. Insert or update articles
    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      const { data, content: body } = matter(content);
      const slug = file.replace('.md', '');
      newSlugs.add(slug);
      
      const query = `
        INSERT INTO articles (slug, title, description, content, category, article_language, ai_generated, programming_language, date)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (slug) 
        DO UPDATE SET 
          title = EXCLUDED.title,
          description = EXCLUDED.description,
          content = EXCLUDED.content,
          category = EXCLUDED.category,
          article_language = EXCLUDED.article_language,
          ai_generated = EXCLUDED.ai_generated,
          programming_language = EXCLUDED.programming_language,
          date = EXCLUDED.date,
          updated_at = CURRENT_TIMESTAMP
        RETURNING id, (xmax = 0) as is_new
      `;
      
      const values = [
        slug,
        data.title,
        data.description,
        body,
        data.category,
        data.article_language,
        data.ai_generated,
        data.programming_language,
        new Date(data.date)
      ];
      
      const result = await pool.query(query, values);
      const action = result.rows[0].is_new ? 'Created' : 'Updated';
      console.log(`${action}: ${data.title}`);
    }
    
    // 4. DELETE articles that no longer exist in markdown
    const slugsToDelete = [...currentSlugs].filter(slug => !newSlugs.has(slug));
    
    if (slugsToDelete.length > 0) {
      console.log(`🗑️  Deleting ${slugsToDelete.length} removed articles...`);
      
      for (const slug of slugsToDelete) {
        await pool.query('DELETE FROM articles WHERE slug = $1', [slug]);
        console.log(`Deleted: ${slug}`);
      }
    }
    
    console.log('✅ Sync completed!');
    console.log(`   Created/Updated: ${files.length}`);
    console.log(`   Deleted: ${slugsToDelete.length}`);
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run
(async () => {
  await initSchema();
  await syncArticles();
})();
