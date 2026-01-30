<template>
  <div class="medium-article">
    <!-- Loading state -->
    <div v-if="pending" class="py-16 text-center">
      <LoadingSpinner text="Loading article..." />
    </div>

    <!-- Not found state -->
    <div v-else-if="!post" class="text-center py-16">
      <Icon name="mdi:file-alert-outline" class="w-20 h-20 text-muted mx-auto mb-4" />
      <h1 class="text-heading text-2xl font-bold mb-2">Article Not Found</h1>
      <p class="text-muted mb-6">The article you're looking for doesn't exist or has been moved.</p>
      <NuxtLink to="/blog" class="btn btn-primary">
        <Icon name="mdi:arrow-left" class="w-4 h-4" />
        Back to Blog
      </NuxtLink>
    </div>

    <!-- Article content -->
    <article v-else>
      <!-- Article header - Medium style -->
      <header class="article-header">
        <!-- Title -->
        <h1 class="article-title">
          {{ post.title }}
        </h1>

        <!-- Author & Meta section - Medium style -->
        <div class="author-section">
          <div class="author-avatar">
            <img 
              src="https://ui-avatars.com/api/?name=Satrio&background=1E293B&color=38BDF8&size=48"
              alt="Satrio"
              class="w-12 h-12 rounded-full object-cover"
            />
          </div>
          <div class="author-info">
            <div class="author-name">
              <span class="font-medium text-heading">Satrio</span>
            </div>
            <div class="article-meta">
              <span>{{ readingTime }} min read</span>
              <span class="meta-dot">·</span>
              <time :datetime="post.date ? new Date(post.date).toISOString() : ''">
                {{ formatDate(post.date) }}
              </time>
              <template v-if="post.article_language">
                <span class="meta-dot">·</span>
                <Icon 
                  v-if="post.article_language === 'indonesian'" 
                  name="circle-flags:id" 
                  class="w-4 h-4 inline"
                />
                <Icon 
                  v-else-if="post.article_language === 'english'" 
                  name="circle-flags:uk" 
                  class="w-4 h-4 inline"
                />
              </template>
            </div>
          </div>
        </div>

        <!-- Action bar - Medium style -->
        <div class="action-bar">
          <div class="action-left">
            <button 
              v-for="share in shareButtons.slice(0, 3)"
              :key="share.platform"
              @click="shareArticle(share.platform)"
              class="action-btn"
              :title="`Share on ${share.label}`"
            >
              <Icon :name="share.icon" class="w-5 h-5" />
            </button>
          </div>
          <div class="action-right">
            <button 
              @click="shareArticle('link')"
              class="action-btn"
              title="Copy link"
            >
              <Icon name="mdi:link-variant" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <!-- Tags/Categories - subtle -->
      <div v-if="post.category || post.programming_language" class="article-tags">
        <span v-if="post.category" class="tag">{{ post.category }}</span>
        <span v-if="post.programming_language" class="tag tag-primary">
          <Icon :name="getLanguageIcon(post.programming_language)" class="w-4 h-4" />
          {{ post.programming_language }}
        </span>
        <span v-if="post.ai_generated === 'ai'" class="tag tag-muted">
          <Icon name="mdi:robot-outline" class="w-3.5 h-3.5" />
          AI Generated
        </span>
        <span v-else-if="post.ai_generated === 'human'" class="tag tag-muted">
          <Icon name="mdi:account-outline" class="w-3.5 h-3.5" />
          Human Written
        </span>
        <span v-else-if="post.ai_generated === 'hybrid'" class="tag tag-muted">
          <Icon name="mdi:account-sync-outline" class="w-3.5 h-3.5" />
          AI-Assisted
        </span>
      </div>

      <!-- Article content -->
      <div class="prose prose-lg">
        <ContentRenderer :value="post" />
      </div>

      <!-- Article footer -->
      <footer class="article-footer">
        <!-- Tags -->
        <div v-if="post.category || post.programming_language" class="footer-tags">
          <span v-if="post.category" class="footer-tag">{{ post.category }}</span>
          <span v-if="post.programming_language" class="footer-tag">{{ post.programming_language }}</span>
        </div>

        <!-- Share section -->
        <div class="share-section">
          <div class="share-buttons">
            <button
              v-for="share in shareButtons"
              :key="share.platform"
              @click="shareArticle(share.platform)"
              class="share-btn"
              :title="`Share on ${share.label}`"
            >
              <Icon :name="share.icon" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Author card - Medium style -->
        <div class="author-card">
          <div class="author-card-avatar">
            <img 
              src="https://ui-avatars.com/api/?name=Satrio&background=1E293B&color=38BDF8&size=64"
              alt="Satrio"
              class="w-16 h-16 rounded-full object-cover"
            />
          </div>
          <div class="author-card-info">
            <p class="author-card-label">Written by</p>
            <h3 class="author-card-name">Satrio</h3>
            <p class="author-card-bio">
              Software developer with 8+ years combining meteorology and full-stack development at BMKG. 
              Building high-performance, real-time data systems for aviation and public safety.
            </p>
          </div>
        </div>
      </footer>

      <!-- Related posts -->
      <div v-if="relatedPosts.length > 0" class="related-section">
        <h3 class="related-title">More from Satrio</h3>
        <div class="related-grid">
          <NuxtLink
            v-for="relatedPost in relatedPosts"
            :key="relatedPost.path"
            :to="relatedPost.path"
            class="related-card"
          >
            <h4 class="related-card-title">{{ relatedPost.title }}</h4>
            <p class="related-card-meta">{{ formatDate(relatedPost.date) }}</p>
          </NuxtLink>
        </div>
      </div>

      <!-- AI Chat Assistant -->
      <ArticleAIChat
        :article-title="post.title"
        :article-content="articleTextContent"
        :article-category="post.category"
        :article-language="post.article_language"
        :article-slug="post.path"
      />
    </article>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'
// Lazy load AI Chat component to reduce initial bundle size
const ArticleAIChat = defineAsyncComponent(() => import('~/components/ArticleAIChat.vue'))

const route = useRoute()
const baseUrl = 'https://satrio.dev'
const { isPostVisible } = usePostVisibility()

// Fetch current post
const { data: post, pending, error, refresh } = await useAsyncData(
  `blog-${route.path}`,
  async () => {
    const result = await queryCollection('blog').path(route.path).first()
    
    // Check if post exists and is visible (not future-dated)
    if (result && !isPostVisible(result)) {
      return null // Return null to show "not found" state
    }
    
    return result
  }
)

// Handle errors
if (error.value) {
  console.error('Error loading blog post:', error.value)
}

// Watch route changes and refresh data
watch(() => route.path, () => {
  refresh()
})

// Fetch all posts for related posts (lazy load - only when needed)
const { data: allPosts } = await useAsyncData(
  'all-blog-posts',
  () => queryCollection('blog').all(),
  {
    lazy: true, // Don't block rendering
    server: false // Only fetch on client to reduce SSR payload
  }
)

// Language icons
const languageIcons: Record<string, string> = {
  javascript: 'logos:javascript',
  python: 'logos:python',
  php: 'logos:php',
  typescript: 'logos:typescript-icon',
  go: 'logos:go',
  java: 'logos:java',
  other: 'mdi:code-tags'
}

// Share buttons
const shareButtons = [
  { platform: 'twitter', icon: 'mdi:twitter', label: 'Twitter' },
  { platform: 'facebook', icon: 'mdi:facebook', label: 'Facebook' },
  { platform: 'linkedin', icon: 'mdi:linkedin', label: 'LinkedIn' },
  { platform: 'link', icon: 'mdi:link-variant', label: 'Copy Link' }
]

// SEO meta tags
watchEffect(() => {
  if (post.value) {
     const postUrl = `${baseUrl}${post.value.path || route.path}`
    const postDate = post.value.date ? new Date(post.value.date).toISOString() : ''
    const description = post.value.description || post.value.body?.value?.[0]?.[2]?.substring(0, 160) || ''

    useHead({
      title: `${post.value.title} | Satrio's Blog`,
      meta: [
        { name: 'description', content: description },
        { name: 'keywords', content: post.value.category || post.value.programming_language || '' },
        { property: 'og:title', content: post.value.title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: postUrl },
        { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
        { property: 'article:published_time', content: postDate },
        { property: 'article:author', content: 'Satrio' },
        { property: 'article:section', content: post.value.category || 'Blog' },
        { property: 'article:tag', content: post.value.programming_language || post.value.category || '' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'author', content: 'Satrio' },
        { name: 'twitter:title', content: post.value.title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` }
      ],
      link: [{ rel: 'canonical', href: postUrl }],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.value.title,
            description: description,
            image: `${baseUrl}/og-image.jpg`,
            datePublished: postDate,
            dateModified: postDate,
            author: { '@type': 'Person', name: 'Satrio', url: baseUrl },
            publisher: { '@type': 'Person', name: 'Satrio', url: baseUrl },
            mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl }
          })
        }
      ]
    })
  }
})

// Extract text content from article body for AI context
const articleTextContent = computed(() => {
  if (!post.value) return ''
  
  // Try to extract text from body
  const extractText = (node: unknown): string => {
    if (!node) return ''
    if (typeof node === 'string') return node
    if (Array.isArray(node)) {
      return node.map(extractText).join(' ')
    }
    if (typeof node === 'object' && node !== null) {
      const obj = node as Record<string, unknown>
      if (obj.value) return extractText(obj.value)
      if (obj.children) return extractText(obj.children)
    }
    return ''
  }
  
  let content = extractText(post.value.body)
  
  // Fallback to description
  if (!content && post.value.description) {
    content = String(post.value.description)
  }
  
  // Limit content length for API (max ~8000 chars)
  return content.slice(0, 8000)
})

// Reading time calculation
const readingTime = computed(() => {
  if (!post.value) return 1
  const text = articleTextContent.value
  if (!text) return 1
  const wordCount = text.trim().split(/\s+/).length
  const time = Math.ceil(wordCount / 200)
  return time > 0 ? time : 1
})

const { filterVisiblePosts } = usePostVisibility()

 // Related posts
 const relatedPosts = computed(() => {
   if (!post.value || !allPosts.value?.length) return []
   return filterVisiblePosts(allPosts.value)
     .filter((p) => p.path !== post.value!.path)
     .filter(
       (p) =>
         (post.value!.category && p.category === post.value!.category) ||
         (post.value!.programming_language && p.programming_language === post.value!.programming_language)
     )
     .slice(0, 3)
 })

// Format date
const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Get language icon
const getLanguageIcon = (lang: string) => {
  return languageIcons[lang.toLowerCase()] || languageIcons.other
}

// Share article
const shareArticle = (platform: string) => {
  if (import.meta.client) {
    const url = window.location.href
    const title = post.value?.title || 'Blog Article'

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank')
        break
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
        break
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank')
        break
      case 'link':
        navigator.clipboard.writeText(url).then(() => {
          alert('Link copied to clipboard!')
        }).catch((err) => {
          console.error('Failed to copy link:', err)
        })
        break
    }
  }
}
</script>

<style scoped>
.medium-article {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Article Header */
.article-header {
  padding-top: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.article-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-heading);
  margin-bottom: 1.5rem;
}

@media (max-width: 640px) {
  .article-title {
    font-size: 1.875rem;
  }
}

/* Author Section */
.author-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.author-avatar img {
  border: 2px solid var(--color-border);
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.author-name {
  color: var(--color-text-heading);
  font-size: 0.9375rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.meta-dot {
  color: var(--color-text-muted);
}

/* Action Bar */
.action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.action-left,
.action-right {
  display: flex;
  gap: 0.25rem;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--color-text-muted);
  transition: all 0.15s ease;
}

.action-btn:hover {
  color: var(--color-text-heading);
  background-color: var(--color-surface);
}

/* Tags */
.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.8125rem;
  border-radius: 9999px;
  background-color: var(--color-surface);
  color: var(--color-text-muted);
}

.tag-primary {
  background-color: rgba(56, 189, 248, 0.1);
  color: var(--color-primary);
}

.tag-muted {
  background-color: transparent;
  border: 1px solid var(--color-border);
}

/* Article Footer */
.article-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.footer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.footer-tag {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  border-radius: 9999px;
  background-color: var(--color-surface);
  color: var(--color-text-body);
  transition: background-color 0.15s ease;
}

.footer-tag:hover {
  background-color: var(--color-surface-elevated);
}

/* Share Section */
.share-section {
  display: flex;
  justify-content: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.share-buttons {
  display: flex;
  gap: 0.5rem;
}

.share-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  transition: all 0.15s ease;
}

.share-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: rgba(56, 189, 248, 0.1);
}

/* Author Card */
.author-card {
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  margin-bottom: 2rem;
}

.author-card-info {
  flex: 1;
}

.author-card-label {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.author-card-name {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 0.5rem;
}

.author-card-bio {
  font-size: 0.9375rem;
  color: var(--color-text-body);
  line-height: 1.5;
}

@media (max-width: 640px) {
  .author-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

/* Related Section */
.related-section {
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.related-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.related-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.related-card {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.15s ease;
}

.related-card:last-child {
  border-bottom: none;
}

.related-card:hover .related-card-title {
  color: var(--color-primary);
}

.related-card-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-heading);
  margin-bottom: 0.25rem;
  transition: color 0.15s ease;
}

.related-card-meta {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}
</style>
