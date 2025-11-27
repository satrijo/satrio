export default defineEventHandler(async (event) => {
  const baseUrl = 'https://satrio.dev'
  
  // Set content type
  event.node.res.setHeader('Content-Type', 'application/xml')
  
  // Get all content collections
  const blogPosts = await queryCollection('blog').all()
  const projects = await queryCollection('projects').all()
  const workExperiences = await queryCollection('work').all()
  
  // Static pages
  const staticPages = [
    { url: baseUrl, changefreq: 'weekly', priority: '1.0' },
    { url: `${baseUrl}/blog`, changefreq: 'weekly', priority: '0.9' },
    { url: `${baseUrl}/projects`, changefreq: 'monthly', priority: '0.8' },
    { url: `${baseUrl}/work`, changefreq: 'monthly', priority: '0.8' }
  ]
  
  // Generate sitemap XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`
  
  // Add static pages
  for (const page of staticPages) {
    sitemap += `  <url>
    <loc>${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
`
  }
  
  // Add blog posts
  for (const post of blogPosts) {
    const postUrl = `${baseUrl}${post._path || post.path}`
    const lastmod = post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    sitemap += `  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`
  }
  
  // Add projects
  for (const project of projects) {
    const projectUrl = `${baseUrl}${project._path || project.path}`
    const lastmod = project.date ? new Date(project.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    sitemap += `  <url>
    <loc>${projectUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`
  }
  
  // Add work experiences (optional, usually less important for SEO)
  for (const work of workExperiences) {
    const workUrl = `${baseUrl}${work._path || work.path}`
    const lastmod = work.start_date ? new Date(work.start_date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    sitemap += `  <url>
    <loc>${workUrl}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>
`
  }
  
  sitemap += `</urlset>`
  
  return sitemap
})

