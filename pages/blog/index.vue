<template>
  <div class="blog-list-page">
    <header class="blog-header">
      <h1 class="blog-title">Blog</h1>
      <p class="blog-subtitle">
        Thoughts, ideas, and insights about technology, development, and software engineering.
      </p>
    </header>
    
    <div v-if="pending" class="posts-list">
      <div v-for="n in 5" :key="n" class="post-card-skeleton">
        <div class="skeleton h-5 w-3/4 mb-3"></div>
        <div class="skeleton h-4 w-full mb-2"></div>
        <div class="skeleton h-4 w-2/3 mb-3"></div>
        <div class="skeleton h-3 w-32"></div>
      </div>
    </div>
    
    <div v-else-if="!articles?.length" class="empty-state">
      <Icon name="mdi:file-document-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No posts yet</h3>
      <p class="text-muted">Check back soon for new content.</p>
    </div>
    
    <div v-else class="posts-list">
      <article 
        v-for="article in articles" 
        :key="article.slug"
        class="post-card"
      >
        <NuxtLink :to="`/blog/${article.slug}`" class="post-card-link">
          <div class="post-card-content">
            <div class="post-meta-top">
              <img 
                src="https://ui-avatars.com/api/?name=S&background=1E293B&color=38BDF8&size=24"
                alt="Satrio"
                class="post-avatar"
              />
              <span class="post-author">Satrio</span>
            </div>

            <h2 class="post-title">{{ article.title }}</h2>
            
            <p v-if="article.description" class="post-description">
              {{ article.description.length > 160 ? article.description.substring(0, 160) + '...' : article.description }}
            </p>
            
            <div class="post-meta-bottom">
              <span class="post-date">{{ formatDate(article.date) }}</span>
              <span class="meta-dot">·</span>
              <span class="post-reading-time">{{ getReadingTime(article.content) }} min read</span>
              <template v-if="article.category">
                <span class="meta-dot">·</span>
                <span class="post-tag">{{ article.category }}</span>
              </template>
            </div>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = 'https://satrio.dev'

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
  params: { limit: 50 }
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
  max-width: 680px;
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

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.post-card {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  transition: all var(--transition-normal);
}

.post-card:hover {
  border-color: var(--color-border-hover);
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-2px);
}

.post-card-link {
  display: block;
  text-decoration: none;
  color: inherit;
}

.post-card-content {
  padding: 1.5rem;
}

.post-meta-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.post-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.post-author {
  font-size: 0.875rem;
  color: var(--color-text-body);
  font-weight: 500;
}

.post-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 0.75rem;
  line-height: 1.4;
}

.post-description {
  font-size: 1rem;
  color: var(--color-text-body);
  line-height: 1.6;
  margin-bottom: 1rem;
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

.post-tag {
  background-color: rgba(56, 189, 248, 0.15);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.post-card-skeleton {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-card);
  padding: 1.5rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
}

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
  
  .post-card-content {
    padding: 1.25rem;
  }
  
  .post-title {
    font-size: 1.125rem;
  }
}
</style>
