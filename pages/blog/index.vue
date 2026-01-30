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
