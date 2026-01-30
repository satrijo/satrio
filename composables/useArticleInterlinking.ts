// Composable untuk mengelola interlinking antar artikel
export function useArticleInterlinking() {
  // Fungsi untuk mendapatkan related articles berdasarkan keywords
  const getRelatedArticles = (currentSlug: string, limit: number = 5) => {
    // Article database
    const articles: Record<string, {
      title: string
      path: string
      category: string
      keywords: string[]
      related?: string[]
    }> = {
      'javascript-dasar': {
        title: 'JavaScript Dasar: Panduan Lengkap untuk Pemula',
        path: '/blog/javascript-dasar-panduan-lengkap-pemula',
        category: 'JavaScript',
        keywords: ['javascript', 'dasar', 'pemula', 'variable', 'tipe data', 'operator'],
        related: ['javascript-array', 'javascript-object', 'javascript-function']
      },
      'javascript-array': {
        title: 'Mengenal Array di JavaScript: Operasi dan Metode Lengkap',
        path: '/blog/mengenal-array-javascript-operasi-metode-lengkap',
        category: 'JavaScript',
        keywords: ['javascript', 'array', 'map', 'filter', 'reduce'],
        related: ['javascript-dasar', 'javascript-object']
      },
      'javascript-object': {
        title: 'JavaScript Object dan Properti Lengkap',
        path: '/blog/javascript-object-dan-properti-lengkap',
        category: 'JavaScript',
        keywords: ['javascript', 'object', 'properti', 'method'],
        related: ['javascript-dasar', 'javascript-array', 'javascript-function']
      },
      'javascript-function': {
        title: 'Function di JavaScript: Declaration, Expression, Arrow',
        path: '/blog/javascript-function-declaration-expression-arrow',
        category: 'JavaScript',
        keywords: ['javascript', 'function', 'arrow function', 'callback'],
        related: ['javascript-dasar', 'javascript-object', 'javascript-async']
      },
      'javascript-async': {
        title: 'JavaScript Asynchronous: Callback, Promise, Async/Await',
        path: '/blog/javascript-asynchronous-callback-promise-async-await',
        category: 'JavaScript',
        keywords: ['javascript', 'async', 'promise', 'callback', 'await'],
        related: ['javascript-function', 'typescript-dasar', 'react-hooks']
      },
      'typescript-dasar': {
        title: 'TypeScript Dasar: Dari JavaScript ke TypeScript',
        path: '/blog/typescript-dasar-dari-javascript-ke-typescript',
        category: 'TypeScript',
        keywords: ['typescript', 'tipe data', 'interface', 'type'],
        related: ['javascript-dasar', 'javascript-async', 'type-system']
      },
      'react-dasar': {
        title: 'React.js Dasar: Panduan Lengkap untuk Pemula dari Nol',
        path: '/blog/reactjs-dasar-panduan-lengkap-untuk-pemula',
        category: 'React',
        keywords: ['react', 'jsx', 'components', 'props', 'state'],
        related: ['javascript-dasar', 'react-hooks', 'react-context']
      },
      'react-hooks': {
        title: 'React Hooks Lengkap: useState, useEffect, dan Custom Hooks',
        path: '/blog/react-hooks-lengkap-usestate-useeffect-dan-custom-hooks',
        category: 'React',
        keywords: ['react', 'hooks', 'useState', 'useEffect'],
        related: ['react-dasar', 'javascript-async', 'react-context', 'react-router']
      },
      'react-context': {
        title: 'React Context API dan State Management',
        path: '/blog/react-context-api-dan-state-management',
        category: 'React',
        keywords: ['react', 'context api', 'state management', 'redux'],
        related: ['react-hooks', 'react-dasar']
      },
      'react-router': {
        title: 'React Router dan Navigasi Aplikasi Single Page',
        path: '/blog/react-router-dan-navigasi-aplikasi-single-page',
        category: 'React',
        keywords: ['react', 'router', 'navigation', 'spa'],
        related: ['react-hooks', 'react-forms']
      },
      'react-forms': {
        title: 'React Forms dan Validasi Modern: React Hook Form dan Zod',
        path: '/blog/react-forms-dan-validasi-modern-react-hook-form-zod',
        category: 'React',
        keywords: ['react', 'forms', 'validation', 'react hook form', 'zod'],
        related: ['react-hooks', 'react-router', 'typescript-react']
      },
      'react-performance': {
        title: 'React Performance Optimization: Teknik dan Best Practices',
        path: '/blog/react-performance-optimization-teknik-dan-best-practices',
        category: 'React',
        keywords: ['react', 'performance', 'memo', 'useMemo', 'lazy loading'],
        related: ['react-hooks', 'react-dasar']
      },
      'react-testing': {
        title: 'React Testing Lengkap: Unit, Integration, dan E2E',
        path: '/blog/react-testing-lengkap-unit-integration-dan-e2e',
        category: 'React',
        keywords: ['react', 'testing', 'jest', 'cypress'],
        related: ['react-hooks', 'react-performance']
      },
      'react-typescript-advanced': {
        title: 'React dengan TypeScript: Advanced Patterns dan Type Safety',
        path: '/blog/react-dengan-typescript-advanced-patterns-dan-type-safety',
        category: 'React',
        keywords: ['react', 'typescript', 'generic', 'type safety'],
        related: ['react-hooks', 'typescript-react', 'react-testing']
      },
      'react-server-components': {
        title: 'React Server Components dan Server Actions: Deep Dive ke Next.js App Router',
        path: '/blog/react-server-components-dan-server-actions-nextjs-app-router',
        category: 'React',
        keywords: ['react', 'server components', 'next.js', 'app router'],
        related: ['react-hooks', 'react-typescript-advanced', 'react-deployment']
      },
      'react-deployment': {
        title: 'React Deployment dan DevOps: CI/CD, Docker, dan Cloud',
        path: '/blog/react-deployment-dan-devops-cicd-docker-dan-cloud',
        category: 'React',
        keywords: ['react', 'deployment', 'devops', 'docker', 'ci/cd'],
        related: ['react-server-components', 'nodejs-deployment']
      },
      'nodejs-dasar': {
        title: 'Node.js Dasar: Memulai dengan JavaScript di Server',
        path: '/blog/nodejs-dasar-memulai-dengan-javascript-di-server',
        category: 'Node.js',
        keywords: ['nodejs', 'server', 'javascript', 'npm'],
        related: ['javascript-async', 'expressjs']
      },
      'expressjs': {
        title: 'Express.js Framework: Membangun REST API',
        path: '/blog/expressjs-framework-membangun-rest-api',
        category: 'Node.js',
        keywords: ['nodejs', 'express', 'rest api', 'middleware'],
        related: ['nodejs-dasar', 'nodejs-mongodb']
      },
      'nodejs-mongodb': {
        title: 'Database dengan Node.js: MongoDB dan Mongoose',
        path: '/blog/database-dengan-nodejs-mongodb-dan-mongoose',
        category: 'Node.js',
        keywords: ['nodejs', 'mongodb', 'mongoose', 'database'],
        related: ['expressjs', 'nodejs-jwt']
      }
    }

    const current = articles[currentSlug]
    if (!current) return []

    const related: Array<{ slug: string; title: string; path: string; category: string; relevance: number }> = []
    
    // Cari artikel dengan keywords yang sama
    Object.entries(articles).forEach(([slug, article]) => {
      if (slug === currentSlug) return
      
      // Hitung relevance berdasarkan shared keywords
      const sharedKeywords = article.keywords.filter(kw => 
        current.keywords.some(ckw => 
          ckw.toLowerCase().includes(kw.toLowerCase()) || 
          kw.toLowerCase().includes(ckw.toLowerCase())
        )
      )
      
      let relevance = sharedKeywords.length
      
      // Boost untuk explicitly related articles
      if (current.related?.includes(slug)) {
        relevance += 5
      }
      
      // Same category gets boost
      if (article.category === current.category) {
        relevance += 2
      }
      
      if (relevance > 0) {
        related.push({
          slug,
          title: article.title,
          path: article.path,
          category: article.category,
          relevance
        })
      }
    })
    
    // Sort by relevance and limit
    return related
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, limit)
  }

  // Fungsi untuk mendapatkan artikel berdasarkan kategori
  const getArticlesByCategory = (category: string) => {
    const articlesByCat: Record<string, { title: string; path: string }> = {
      'JavaScript': {
        'javascript-dasar': { title: 'JavaScript Dasar', path: '/blog/javascript-dasar-panduan-lengkap-pemula' },
        'javascript-array': { title: 'JavaScript Array', path: '/blog/mengenal-array-javascript-operasi-metode-lengkap' },
        'javascript-object': { title: 'JavaScript Object', path: '/blog/javascript-object-dan-properti-lengkap' },
        'javascript-function': { title: 'JavaScript Function', path: '/blog/javascript-function-declaration-expression-arrow' },
        'javascript-async': { title: 'JavaScript Async', path: '/blog/javascript-asynchronous-callback-promise-async-await' }
      },
      'TypeScript': {
        'typescript-dasar': { title: 'TypeScript Dasar', path: '/blog/typescript-dasar-dari-javascript-ke-typescript' },
        'type-system': { title: 'Type System', path: '/blog/type-system-di-typescript-type-dan-interface' },
        'typescript-generic': { title: 'TypeScript Generic', path: '/blog/generic-di-typescript-fleksibel-dan-type-safe' }
      },
      'React': {
        'react-dasar': { title: 'React Dasar', path: '/blog/reactjs-dasar-panduan-lengkap-untuk-pemula' },
        'react-hooks': { title: 'React Hooks', path: '/blog/react-hooks-lengkap-usestate-useeffect-dan-custom-hooks' },
        'react-context': { title: 'React Context', path: '/blog/react-context-api-dan-state-management' },
        'react-router': { title: 'React Router', path: '/blog/react-router-dan-navigasi-aplikasi-single-page' },
        'react-forms': { title: 'React Forms', path: '/blog/react-forms-dan-validasi-modern-react-hook-form-zod' },
        'react-performance': { title: 'React Performance', path: '/blog/react-performance-optimization-teknik-dan-best-practices' },
        'react-testing': { title: 'React Testing', path: '/blog/react-testing-lengkap-unit-integration-dan-e2e' },
        'react-typescript-advanced': { title: 'React TypeScript Advanced', path: '/blog/react-dengan-typescript-advanced-patterns-dan-type-safety' },
        'react-server-components': { title: 'React Server Components', path: '/blog/react-server-components-dan-server-actions-nextjs-app-router' },
        'react-deployment': { title: 'React Deployment', path: '/blog/react-deployment-dan-devops-cicd-docker-dan-cloud' }
      },
      'Node.js': {
        'nodejs-dasar': { title: 'Node.js Dasar', path: '/blog/nodejs-dasar-memulai-dengan-javascript-di-server' },
        'expressjs': { title: 'Express.js', path: '/blog/expressjs-framework-membangun-rest-api' },
        'nodejs-mongodb': { title: 'Node.js MongoDB', path: '/blog/database-dengan-nodejs-mongodb-dan-mongoose' }
      }
    }
    
    return articlesByCat[category] || {}
  }

  return {
    getRelatedArticles,
    getArticlesByCategory
  }
}
