<template>
  <div class="blog-list-page">
    <!-- Page header - Medium style -->
    <header class="blog-header">
      <h1 class="blog-title">Blog</h1>
      <p class="blog-subtitle">
        Thoughts, ideas, and insights about technology, development, and software engineering.
      </p>
    </header>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="posts-list">
      <div v-for="n in 5" :key="n" class="post-card-skeleton">
        <div class="skeleton h-5 w-3/4 mb-3"></div>
        <div class="skeleton h-4 w-full mb-2"></div>
        <div class="skeleton h-4 w-2/3 mb-3"></div>
        <div class="skeleton h-3 w-32"></div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!allPosts?.length" class="empty-state">
      <Icon name="mdi:file-document-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No posts yet</h3>
      <p class="text-muted">Check back soon for new content.</p>
    </div>
    
    <!-- Posts list - Medium style -->
    <div v-else class="posts-list">
      <article 
        v-for="post in paginatedPosts" 
        :key="post.path"
        class="post-card"
      >
        <NuxtLink :to="post.path" class="post-card-link">
          <div class="post-card-content">
            <!-- Author & Date -->
            <div class="post-meta-top">
              <img 
                src="https://ui-avatars.com/api/?name=S&background=1E293B&color=38BDF8&size=24"
                alt="Satrio"
                class="post-avatar"
              />
              <span class="post-author">Satrio</span>
            </div>

            <!-- Title -->
            <h2 class="post-title">{{ post.title }}</h2>
            
            <!-- Description -->
            <p v-if="getDescription(post)" class="post-description">
              {{ getDescription(post) }}
            </p>
            
            <!-- Meta bottom -->
            <div class="post-meta-bottom">
              <span class="post-date">{{ formatDate(post.date) }}</span>
              <span class="meta-dot">·</span>
              <span class="post-reading-time">{{ getReadingTime(post) }} min read</span>
              <template v-if="post.category">
                <span class="meta-dot">·</span>
                <span class="post-tag">{{ post.category }}</span>
              </template>
              <Icon
                v-if="post.article_language === 'indonesian'"
                name="circle-flags:id"
                class="w-4 h-4 ml-2"
                title="Indonesian"
              />
              <Icon
                v-else-if="post.article_language === 'english'"
                name="circle-flags:uk"
                class="w-4 h-4 ml-2"
                title="English"
              />
            </div>
          </div>
        </NuxtLink>
      </article>

      <!-- Pagination - Medium style -->
      <div v-if="totalPages > 1" class="pagination">
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="pagination-btn"
          :class="{ 'pagination-btn-disabled': currentPage === 1 }"
        >
          <Icon name="heroicons:chevron-left-20-solid" class="w-5 h-5" />
        </button>

        <div class="pagination-info">
          Page {{ currentPage }} of {{ totalPages }}
        </div>

        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="pagination-btn"
          :class="{ 'pagination-btn-disabled': currentPage === totalPages }"
        >
          <Icon name="heroicons:chevron-right-20-solid" class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = 'https://satrio.dev'
const route = useRoute()
const router = useRouter()

const postsPerPage = 10
const currentPage = ref(Number(route.query.page) || 1)

watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

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
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` }
  ],
  link: [{ rel: 'canonical', href: `${baseUrl}/blog` }]
})

const { data: allPosts, pending } = await useAsyncData(
  'blog-list',
  () => queryCollection('blog').order('date', 'DESC').all(),
  { lazy: true }
)

const totalPages = computed(() => {
  if (!allPosts.value) return 0
  return Math.ceil(allPosts.value.length / postsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * postsPerPage
})

const paginatedPosts = computed(() => {
  if (!allPosts.value) return []
  return allPosts.value.slice(startIndex.value, startIndex.value + postsPerPage)
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  router.push({ query: { page: page.toString() } })
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getDescription = (post: any) => {
  if (post.description) {
    return post.description.length > 160 
      ? post.description.substring(0, 160) + '...' 
      : post.description
  }
  if (post.body?.value?.[0]?.[2]) {
    const text = post.body.value[0][2]
    return text.length > 160 ? text.substring(0, 160) + '...' : text
  }
  return ''
}

const getReadingTime = (post: any) => {
  let text = ''
  if (post.body?.value?.[0]?.[2]) {
    text = String(post.body.value[0][2])
  } else if (post.description) {
    text = String(post.description)
  }
  if (!text) return 1
  const wordCount = text.trim().split(/\s+/).length
  const time = Math.ceil(wordCount / 200)
  return time > 0 ? time : 1
}
</script>

<style scoped>
.blog-list-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Header */
.blog-header {
  padding: 3rem 0 2rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.blog-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-heading);
  margin-bottom: 0.5rem;
}

.blog-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

/* Posts List */
.posts-list {
  display: flex;
  flex-direction: column;
}

/* Post Card */
.post-card {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.post-card:last-of-type {
  border-bottom: none;
}

.post-card-link {
  display: block;
}

.post-card-content {
  display: flex;
  flex-direction: column;
}

/* Meta Top */
.post-meta-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.post-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.post-author {
  font-size: 0.8125rem;
  color: var(--color-text-body);
}

/* Title */
.post-title {
  font-family: var(--font-prose);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-text-heading);
  margin-bottom: 0.375rem;
  transition: color 0.15s ease;
}

.post-card-link:hover .post-title {
  color: var(--color-primary);
}

/* Description */
.post-description {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

/* Meta Bottom */
.post-meta-bottom {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.meta-dot {
  color: var(--color-text-muted);
}

.post-tag {
  padding: 0.125rem 0.5rem;
  background-color: var(--color-surface);
  border-radius: 9999px;
  font-size: 0.75rem;
}

/* Skeleton */
.post-card-skeleton {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 2rem 0;
}

.pagination-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 50%;
  transition: all 0.15s ease;
}

.pagination-btn:hover:not(.pagination-btn-disabled) {
  color: var(--color-text-heading);
  border-color: var(--color-text-heading);
}

.pagination-btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 0;
}

@media (max-width: 640px) {
  .blog-title {
    font-size: 2rem;
  }
  
  .post-title {
    font-size: 1.125rem;
  }
}
</style>
