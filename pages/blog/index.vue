<template>
  <div>
    <!-- Page header -->
    <PageHeader
      title="Blog"
      subtitle="Thoughts, ideas, and insights about technology, development, and the intersection of meteorology with software."
    />
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="space-y-4">
      <SkeletonCard v-for="n in 5" :key="n" show-tags />
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!allPosts?.length" class="text-center py-16">
      <Icon name="mdi:file-document-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No posts yet</h3>
      <p class="text-muted">Check back soon for new content.</p>
    </div>
    
     <!-- Posts list -->
     <div v-else class="space-y-4">
       <ContentCard
         v-for="post in paginatedPosts"
         :key="post.path"
         :title="post.title"
         :description="getDescription(post)"
         :date="formatDate(post.date)"
         :to="post.path"
       >
        <template #meta>
          <span class="flex items-center gap-1">
            <Icon name="mdi:calendar-outline" class="w-3.5 h-3.5" />
            {{ formatDate(post.date) }}
          </span>
          <Icon
            v-if="post.article_language === 'indonesian'"
            name="circle-flags:id"
            class="w-4 h-4"
            title="Indonesian"
          />
          <Icon
            v-else-if="post.article_language === 'english'"
            name="circle-flags:uk"
            class="w-4 h-4"
            title="English"
          />
        </template>
        
        <template #badges>
          <Badge 
            v-if="post.programming_language" 
            variant="primary"
            :icon="getLanguageIcon(post.programming_language)"
          >
            {{ post.programming_language }}
          </Badge>
          <Badge v-if="post.category" variant="surface">
            {{ post.category }}
          </Badge>
          <Badge 
            v-if="post.ai_generated === 'ai'" 
            variant="purple"
            icon="mdi:robot-outline"
          >
            AI Generated
          </Badge>
          <Badge 
            v-else-if="post.ai_generated === 'human'" 
            variant="success"
            icon="mdi:account-outline"
          >
            Human Written
          </Badge>
          <Badge 
            v-else-if="post.ai_generated === 'hybrid'" 
            variant="warning"
            icon="mdi:account-sync-outline"
          >
            AI-Assisted
          </Badge>
        </template>
      </ContentCard>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-12 flex justify-center items-center gap-2">
        <!-- Previous Button -->
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="btn btn-ghost !p-2"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          aria-label="Previous page"
        >
          <Icon name="heroicons:chevron-left-20-solid" class="w-5 h-5" />
        </button>

        <!-- Page Numbers -->
        <button
          v-for="page in displayedPages"
          :key="page"
          @click="goToPage(page)"
          class="btn min-w-[2.5rem] h-10"
          :class="page === currentPage ? 'btn-primary' : 'btn-ghost'"
          :aria-label="`Go to page ${page}`"
          :aria-current="page === currentPage ? 'page' : undefined"
        >
          {{ page }}
        </button>

        <!-- Next Button -->
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="btn btn-ghost !p-2"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          aria-label="Next page"
        >
          <Icon name="heroicons:chevron-right-20-solid" class="w-5 h-5" />
        </button>
      </div>

      <!-- Pagination Info -->
      <div v-if="totalPages > 1" class="mt-4 text-center text-sm text-muted">
        Showing {{ startIndex + 1 }}-{{ endIndex }} of {{ allPosts?.length }} posts
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/ui/PageHeader.vue'
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import ContentCard from '~/components/ui/ContentCard.vue'
import Badge from '~/components/ui/Badge.vue'

const baseUrl = 'https://satrio.dev'
const route = useRoute()
const router = useRouter()

// Pagination settings
const postsPerPage = 10
const currentPage = ref(Number(route.query.page) || 1)

// Watch for route query changes
watch(() => route.query.page, (newPage) => {
  currentPage.value = Number(newPage) || 1
  // Scroll to top when page changes
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

useHead({
  title: 'Blog | Satrio - Articles about Web Development & Technology',
  meta: [
    {
      name: 'description',
      content: 'Articles and tutorials about web development, programming, and technology. Learn from a Full-Stack Engineer with years of experience.'
    },
    { name: 'keywords', content: 'web development, programming, tutorials, blog, technology, software engineering' },
    { property: 'og:title', content: 'Blog | Satrio - Articles about Web Development & Technology' },
    { property: 'og:description', content: 'Articles and tutorials about web development, programming, and technology.' },
    { property: 'og:url', content: `${baseUrl}/blog` },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:title', content: 'Blog | Satrio' },
    { name: 'twitter:description', content: 'Articles and tutorials about web development, programming, and technology.' }
  ],
  link: [{ rel: 'canonical', href: `${baseUrl}/blog` }]
})

const languageIcons: Record<string, string> = {
  javascript: 'logos:javascript',
  python: 'logos:python',
  php: 'logos:php',
  typescript: 'logos:typescript-icon',
  go: 'logos:go',
  java: 'logos:java',
  other: 'mdi:code-tags'
}

const { data: allPosts, pending } = await useAsyncData(
  'blog-list',
  () => queryCollection('blog').order('date', 'DESC').all(),
  { lazy: true }
)

// Pagination computed properties
const totalPages = computed(() => {
  if (!allPosts.value) return 0
  return Math.ceil(allPosts.value.length / postsPerPage)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * postsPerPage
})

const endIndex = computed(() => {
  if (!allPosts.value) return 0
  return Math.min(startIndex.value + postsPerPage, allPosts.value.length)
})

const paginatedPosts = computed(() => {
  if (!allPosts.value) return []
  return allPosts.value.slice(startIndex.value, endIndex.value)
})

// Display max 7 page numbers with ellipsis
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const delta = 2 // Show 2 pages on each side of current
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  
  const pages: number[] = []
  
  // Always show first page
  pages.push(1)
  
  // Calculate range around current page
  const start = Math.max(2, current - delta)
  const end = Math.min(total - 1, current + delta)
  
  // Add ellipsis after first page if needed
  if (start > 2) {
    pages.push(-1) // -1 represents ellipsis
  }
  
  // Add pages around current
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  // Add ellipsis before last page if needed
  if (end < total - 1) {
    pages.push(-2) // -2 represents ellipsis
  }
  
  // Always show last page
  if (total > 1) {
    pages.push(total)
  }
  
  return pages
})

const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  router.push({ query: { page: page.toString() } })
}

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDescription = (post: any) => {
  if (post.description) {
    return post.description.length > 150 
      ? post.description.substring(0, 150) + '...' 
      : post.description
  }
  if (post.body?.value?.[0]?.[2]) {
    const text = post.body.value[0][2]
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }
  return ''
}

const getLanguageIcon = (lang: string) => {
  return languageIcons[lang.toLowerCase()] || languageIcons.other
}
</script>
