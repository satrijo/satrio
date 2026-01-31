<template>
  <div class="blog-list-page">
    <header class="blog-header">
      <h1 class="blog-title">Blog</h1>
      <p class="blog-subtitle">
        Thoughts, ideas, and insights about technology, development, and software engineering.
      </p>
    </header>
    
    <div v-if="pending" class="posts-grid">
      <div v-for="n in 9" :key="n" class="post-card-skeleton">
        <div class="skeleton h-32 w-full mb-4 rounded-lg"></div>
        <div class="skeleton h-5 w-3/4 mb-3"></div>
        <div class="skeleton h-4 w-full mb-2"></div>
        <div class="skeleton h-4 w-2/3 mb-3"></div>
        <div class="skeleton h-3 w-32"></div>
      </div>
    </div>
    
    <div v-else-if="!paginatedArticles?.length" class="empty-state">
      <Icon name="mdi:file-document-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No posts yet</h3>
      <p class="text-muted">Check back soon for new content.</p>
    </div>
    
    <div v-else>
      <div class="posts-grid">
        <article 
          v-for="article in paginatedArticles" 
          :key="article.slug"
          class="post-card"
        >
          <NuxtLink :to="`/blog/${article.slug}`" class="post-card-link">
            <div class="post-card-image" v-if="article.image">
              <img :src="article.image" :alt="article.title" />
            </div>
            <div class="post-card-image placeholder" v-else>
              <Icon name="mdi:image-outline" class="w-12 h-12 text-muted" />
            </div>
            
            <div class="post-card-content">
              <div class="post-meta-top">
                <span v-if="article.category" class="post-category">{{ article.category }}</span>
              </div>

              <h2 class="post-title">{{ article.title }}</h2>
              
              <p v-if="article.description" class="post-description">
                {{ article.description.length > 120 ? article.description.substring(0, 120) + '...' : article.description }}
              </p>
              
              <div class="post-meta-bottom">
                <span class="post-date">{{ formatDate(article.date) }}</span>
                <span class="meta-dot">·</span>
                <span class="post-reading-time">{{ getReadingTime(article.content) }} min read</span>
              </div>
            </div>
          </NuxtLink>
        </article>
      </div>
      
      <!-- Pagination -->
      <div v-if="totalPages > 1" class="pagination">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
          class="pagination-btn"
          :class="{ disabled: currentPage === 1 }"
        >
          <Icon name="mdi:chevron-left" class="w-5 h-5" />
          Previous
        </button>
        
        <div class="pagination-pages">
          <button 
            v-for="page in visiblePages" 
            :key="page"
            @click="currentPage = page"
            class="pagination-page"
            :class="{ active: currentPage === page }"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="currentPage++" 
          :disabled="currentPage === totalPages"
          class="pagination-btn"
          :class="{ disabled: currentPage === totalPages }"
        >
          Next
          <Icon name="mdi:chevron-right" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = 'https://satrio.dev'
const ITEMS_PER_PAGE = 9

useHead({
  title: 'Blog | Satrio',
  meta: [
    {
      name: 'description',
      content: 'Articles and tutorials about web development, programming, and technology.'
    },
    { property: 'og:title', content: 'Blog | Satrio' },
    { property: 'og:description', content: 'Articles and tutorials about web development, programming, and technology.' },
    { property: 'og:url', content: `${baseUrl}/blog` },
    { property: 'og:type', content: 'website' }
  ],
  link: [{ rel: 'canonical', href: `${baseUrl}/blog` }]
})

// Fetch from PostgreSQL API
const { data: response, pending } = await useFetch('/api/articles', {
  params: { limit: 100 }
})

const articles = computed(() => {
  if (!response.value?.articles) return []
  // Filter out future-dated articles
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return response.value.articles.filter((article: any) => {
    const articleDate = new Date(article.date)
    articleDate.setHours(0, 0, 0, 0)
    return articleDate <= now
  })
})

// Pagination
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(articles.value.length / ITEMS_PER_PAGE))

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE
  const end = start + ITEMS_PER_PAGE
  return articles.value.slice(start, end)
})

// Visible page numbers (max 5)
const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  
  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const formatDate = (date: string | Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getReadingTime = (content: string) => {
  if (!content) return 1
  const wordCount = content.trim().split(/\s+/).length
  const time = Math.ceil(wordCount / 200)
  return time > 0 ? time : 1
}
</script>

<style scoped>
.blog-list-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.blog-header {
  text-align: center;
  margin-bottom: 3rem;
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-heading);
  margin-bottom: 0.75rem;
}

.blog-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  max-width: 500px;
  margin: 0 auto;
  line-height: 1.6;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.post-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  transition: all var(--transition-normal);
  overflow: hidden;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.post-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-4px);
}

.post-card-link {
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  height: 100%;
}

.post-card-image {
  aspect-ratio: 16/9;
  overflow: hidden;
  background-color: var(--color-surface-elevated);
}

.post-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.post-card:hover .post-card-image img {
  transform: scale(1.05);
}

.post-card-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.post-card-content {
  padding: 1.25rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.post-meta-top {
  margin-bottom: 0.75rem;
}

.post-category {
  background-color: rgba(56, 189, 248, 0.15);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.post-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 0.75rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-description {
  font-size: 0.9375rem;
  color: var(--color-text-body);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.post-meta-bottom {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  flex-wrap: wrap;
}

.meta-dot {
  color: var(--color-text-muted);
}

.post-card-skeleton {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 1.25rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  color: var(--color-text-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(.disabled) {
  background-color: var(--color-surface-elevated);
  border-color: var(--color-border-hover);
  color: var(--color-text-heading);
}

.pagination-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  gap: 0.25rem;
}

.pagination-page {
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-button);
  color: var(--color-text-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-page:hover {
  background-color: var(--color-surface-elevated);
  border-color: var(--color-border-hover);
  color: var(--color-text-heading);
}

.pagination-page.active {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: var(--color-background);
}

/* Tablet: 2 columns */
@media (max-width: 1024px) {
  .posts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile: 1 column */
@media (max-width: 640px) {
  .blog-list-page {
    padding: 1.5rem 1rem;
  }
  
  .blog-title {
    font-size: 2rem;
  }
  
  .blog-subtitle {
    font-size: 1rem;
  }
  
  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .post-card-content {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 1rem;
  }
  
  .pagination {
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .pagination-pages {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
