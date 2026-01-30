// Composable untuk mengelola interlinking antar artikel secara dinamis
export function useArticleInterlinking() {
  // Keywords mapping untuk kategori dan topik
  const keywordCategories: Record<string, string[]> = {
    'javascript': ['javascript', 'js', 'es6', 'ecmascript'],
    'typescript': ['typescript', 'ts', 'type', 'interface'],
    'react': ['react', 'jsx', 'component', 'hook', 'usestate', 'useeffect'],
    'nodejs': ['nodejs', 'node.js', 'express', 'server', 'backend'],
    'database': ['database', 'mongodb', 'mongoose', 'sql', 'nosql'],
    'testing': ['testing', 'jest', 'cypress', 'unit test', 'e2e'],
    'deployment': ['deployment', 'docker', 'ci/cd', 'vercel', 'cloud'],
    'performance': ['performance', 'optimization', 'memo', 'lazy loading'],
    'async': ['async', 'promise', 'await', 'callback', 'fetch'],
    'forms': ['forms', 'validation', 'react hook form', 'zod'],
    'router': ['router', 'navigation', 'routing', 'spa'],
    'security': ['security', 'authentication', 'jwt', 'auth']
  }

  // Fungsi untuk mengekstrak keywords dari konten artikel
  const extractKeywords = (post: any): string[] => {
    const keywords: string[] = []
    
    // Dari kategori
    if (post.category) {
      keywords.push(post.category.toLowerCase())
    }
    
    // Dari programming_language
    if (post.programming_language) {
      keywords.push(post.programming_language.toLowerCase())
    }
    
    // Dari title
    if (post.title) {
      const titleWords = post.title.toLowerCase().split(/\s+/)
      keywords.push(...titleWords)
    }
    
    // Dari deskripsi
    if (post.description) {
      const descWords = post.description.toLowerCase().split(/\s+/)
      keywords.push(...descWords)
    }
    
    // Cek keyword kategori
    Object.entries(keywordCategories).forEach(([category, categoryKeywords]) => {
      const content = `${post.title} ${post.description} ${post.category}`.toLowerCase()
      if (categoryKeywords.some(kw => content.includes(kw))) {
        keywords.push(category)
      }
    })
    
    return [...new Set(keywords)] // Remove duplicates
  }

  // Fungsi untuk mendapatkan related articles secara dinamis
  const getRelatedArticles = (
    currentPost: any,
    allPosts: any[],
    limit: number = 5
  ): Array<{
    path: string
    title: string
    category: string
    relevance: number
  }> => {
    if (!currentPost || !allPosts?.length) return []

    const currentKeywords = extractKeywords(currentPost)
    const currentPath = currentPost.path || currentPost._path
    
    const related = allPosts
      .filter((post) => {
        const postPath = post.path || post._path
        return postPath !== currentPath
      })
      .map((post) => {
        const postKeywords = extractKeywords(post)
        
        // Hitung relevance
        let relevance = 0
        
        // Shared keywords
        const sharedKeywords = currentKeywords.filter(kw => 
          postKeywords.some(pkw => 
            pkw.includes(kw) || kw.includes(pkw)
          )
        )
        relevance += sharedKeywords.length * 2
        
        // Same category (boost besar)
        if (post.category === currentPost.category) {
          relevance += 10
        }
        
        // Same programming language
        if (post.programming_language === currentPost.programming_language) {
          relevance += 5
        }
        
        // AI generated articles get slight boost for consistency
        if (post.ai_generated === 'ai' && currentPost.ai_generated === 'ai') {
          relevance += 1
        }
        
        return {
          path: post.path || post._path,
          title: post.title,
          category: post.category,
          relevance
        }
      })
      .filter((item) => item.relevance > 0)
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
    
    return related
  }

  // Fungsi untuk mendapatkan artikel dalam series yang sama
  const getSeriesArticles = (
    currentPost: any,
    allPosts: any[],
    limit: number = 3
  ) => {
    if (!currentPost?.category) return []
    
    return allPosts
      .filter((post) => 
        post.category === currentPost.category &&
        (post.path || post._path) !== (currentPost.path || currentPost._path)
      )
      .slice(0, limit)
      .map((post) => ({
        path: post.path || post._path,
        title: post.title,
        category: post.category
      }))
  }

  // Fungsi untuk mendapatkan learning path
  const getLearningPath = (
    currentPost: any,
    allPosts: any[]
  ): { prev: any[]; next: any[] } => {
    if (!currentPost?.category) return { prev: [], next: [] }
    
    const categoryPosts = allPosts
      .filter((post) => post.category === currentPost.category)
      .sort((a, b) => {
        const dateA = new Date(a.date || 0)
        const dateB = new Date(b.date || 0)
        return dateA.getTime() - dateB.getTime()
      })
    
    const currentIndex = categoryPosts.findIndex(
      (post) => (post.path || post._path) === (currentPost.path || currentPost._path)
    )
    
    if (currentIndex === -1) return { prev: [], next: [] }
    
    return {
      prev: categoryPosts
        .slice(0, currentIndex)
        .slice(-2)
        .map((post) => ({
          path: post.path || post._path,
          title: post.title,
          category: post.category
        })),
      next: categoryPosts
        .slice(currentIndex + 1)
        .slice(0, 2)
        .map((post) => ({
          path: post.path || post._path,
          title: post.title,
          category: post.category
        }))
    }
  }

  return {
    extractKeywords,
    getRelatedArticles,
    getSeriesArticles,
    getLearningPath
  }
}
