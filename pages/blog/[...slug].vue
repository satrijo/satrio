<template>
  <!-- Loading state -->
  <div v-if="pending" class="py-8">
    <LoadingSpinner text="Loading article..." />
  </div>

  <!-- Not found state -->
  <div v-else-if="!post" class="text-center py-16">
    <Icon name="mdi:file-alert-outline" class="w-20 h-20 text-muted mx-auto mb-4" />
    <h1 class="text-heading text-2xl font-bold mb-2">Article Not Found</h1>
    <p class="text-muted mb-6">The article you're looking for doesn't exist or has been moved.</p>
    <NuxtLink to="/blog" class="btn btn-primary">
      <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
      Back to Blog
    </NuxtLink>
  </div>

  <!-- Article content -->
  <article v-else class="py-8 w-full max-w-full">
    <!-- Article header -->
    <header class="mb-10 text-center">
      <!-- Badges -->
      <div class="flex flex-wrap justify-center gap-2 mb-4">
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
          v-if="post.article_language === 'indonesian'" 
          variant="surface"
          icon="circle-flags:id"
        >
          Indonesia
        </Badge>
        <Badge 
          v-else-if="post.article_language === 'english'" 
          variant="surface"
          icon="circle-flags:uk"
        >
          English
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
      </div>

      <!-- Title -->
      <h1 class="text-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight px-4 sm:px-0">
        {{ post.title }}
      </h1>

      <!-- Meta info -->
      <div class="flex items-center justify-center gap-4 text-muted text-sm">
        <time 
          :datetime="post.date ? new Date(post.date).toISOString() : ''"
          class="flex items-center gap-1.5"
        >
          <Icon name="mdi:calendar-outline" class="w-4 h-4" />
          {{ formatDate(post.date) }}
        </time>
        <span class="text-[var(--color-border)]">|</span>
        <span class="flex items-center gap-1.5">
          <Icon name="mdi:clock-outline" class="w-4 h-4" />
          {{ readingTime }} min read
        </span>
      </div>
    </header>

    <!-- Article content -->
    <div class="prose prose-lg w-full max-w-full lg:max-w-4xl mx-auto mb-12 px-4 sm:px-0">
      <ContentRenderer :value="post" />
    </div>

    <!-- Share section -->
    <div class="surface-card p-4 sm:p-6 mb-8">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <p class="text-muted text-xs sm:text-sm">Share this article:</p>
        <div class="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          <button
            v-for="share in shareButtons"
            :key="share.platform"
            @click="shareArticle(share.platform)"
            class="btn btn-ghost !p-2.5 flex-shrink-0"
            :title="`Share on ${share.label}`"
          >
            <Icon :name="share.icon" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

     <!-- Related posts -->
    <div v-if="relatedPosts.length > 0" class="mb-12">
      <h3 class="section-title mb-4">Related Articles</h3>
       <div class="grid sm:grid-cols-2 gap-4">
         <ContentCard
           v-for="relatedPost in relatedPosts"
           :key="relatedPost.path"
           :title="relatedPost.title"
           :date="formatDate(relatedPost.date)"
           :to="relatedPost.path"
         />
       </div>
     </div>

    <!-- Back button -->
    <div class="mt-12 pt-8 border-t border-[var(--color-border)]">
      <NuxtLink to="/blog" class="link-primary inline-flex items-center gap-2">
        <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
        Back to Blog
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import Badge from '~/components/ui/Badge.vue'
import ContentCard from '~/components/ui/ContentCard.vue'
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const route = useRoute()
const baseUrl = 'https://satrio.dev'

// Fetch current post
const { data: post, pending, error, refresh } = await useAsyncData(
  `blog-${route.path}`,
  () => queryCollection('blog').path(route.path).first()
)

// Handle errors
if (error.value) {
  console.error('Error loading blog post:', error.value)
}

// Watch route changes and refresh data
watch(() => route.path, () => {
  refresh()
})

// Fetch all posts for related posts (lazy load)
const { data: allPosts } = await useAsyncData(
  'all-blog-posts',
  () => queryCollection('blog').all(),
  { lazy: true }
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

// Reading time calculation
const readingTime = computed(() => {
  if (!post.value) return 1
  let text = ''
  if (post.value.body?.value?.[0]?.[2]) {
    text = String(post.value.body.value[0][2])
  } else if (post.value.description) {
    text = String(post.value.description)
  }
  if (!text) return 1
  const wordCount = text.trim().split(/\s+/).length
  const time = Math.ceil(wordCount / 200)
  return time > 0 ? time : 1
})

 // Related posts
 const relatedPosts = computed(() => {
   if (!post.value || !allPosts.value?.length) return []
   return allPosts.value
     .filter((p) => p.path !== post.value!.path)
     .filter(
       (p) =>
         (post.value!.category && p.category === post.value!.category) ||
         (post.value!.programming_language && p.programming_language === post.value!.programming_language)
     )
     .slice(0, 2)
 })

// Format date
const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
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
