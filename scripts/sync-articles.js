#!/usr/bin/env node
/**
 * Sync markdown articles to PostgreSQL
 * Run this script after git pull to sync content changes
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const matter = require('gray-matter');

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@db:5432/satrio'
});

const CONTENT_DIR = path.join(__dirname, '../content/blog');

async function syncArticles() {
  console.log('🔄 Syncing articles to PostgreSQL...');
  
  try {
    // Get all markdown files
    const files = fs.readdirSync(CONTENT_DIR)
      .filter(f => f.endsWith('.md'));
    
    console.log(`📄 Found ${files.length} markdown files`);
    
    for (const file of files) {
      const filePath = path.join(CONTENT_DIR, file);
      const content = fs.readFileSync(filePath, 'utf-8');
      
      // Parse frontmatter
      const { data, content: body } = matter(content);
      
      // Generate slug from filename
      const slug = file.replace('.md', '');
      
      // Insert or update article
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
        RETURNING id
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
      console.log(`✅ Synced: ${data.title} (ID: ${result.rows[0].id})`);
    }
    
    // Remove articles that no longer exist in markdown
    const slugs = files.map(f => f.replace('.md', ''));
    const deleteQuery = `
      DELETE FROM articles 
      WHERE slug NOT IN (${slugs.map((_, i) => `$${i + 1}`).join(',')})
      RETURNING slug
    `;
    
    const deleted = await pool.query(deleteQuery, slugs);
    if (deleted.rows.length > 0) {
      console.log(`🗑️  Removed: ${deleted.rows.map(r => r.slug).join(', ')}`);
    }
    
    console.log('✅ Sync completed successfully!');
    
  } catch (error) {
    console.error('❌ Sync failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run sync
syncArticles();
