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
    <div v-else-if="!posts?.length" class="text-center py-16">
      <Icon name="mdi:file-document-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No posts yet</h3>
      <p class="text-muted">Check back soon for new content.</p>
    </div>
    
     <!-- Posts list -->
     <div v-else class="space-y-4">
       <ContentCard
         v-for="post in posts"
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
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/ui/PageHeader.vue'
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import ContentCard from '~/components/ui/ContentCard.vue'
import Badge from '~/components/ui/Badge.vue'

const baseUrl = 'https://satrio.dev'

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

const { data: posts, pending } = await useAsyncData(
  'blog-list',
  () => queryCollection('blog').order('date', 'DESC').all(),
  { lazy: true }
)

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
