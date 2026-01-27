<template>
  <section>
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Latest Posts</h2>
      <NuxtLink to="/blog" class="link-primary text-sm font-medium flex items-center gap-1">
        View all
        <Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4" />
      </NuxtLink>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="space-y-4">
      <SkeletonCard v-for="n in 3" :key="n" show-tags />
    </div>
    
    <!-- Posts list -->
    <div v-else class="space-y-4">
       <ContentCard
         v-for="post in posts"
         :key="post._path"
         :title="post.title"
         :description="getDescription(post)"
         :date="formatDate(post.date)"
         :to="post._path"
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
          />
          <Icon
            v-else-if="post.article_language === 'english'"
            name="circle-flags:uk"
            class="w-4 h-4"
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
            AI
          </Badge>
          <Badge 
            v-else-if="post.ai_generated === 'human'" 
            variant="success"
            icon="mdi:account-outline"
          >
            Human
          </Badge>
          <Badge 
            v-else-if="post.ai_generated === 'hybrid'" 
            variant="warning"
            icon="mdi:account-sync-outline"
          >
            Hybrid
          </Badge>
        </template>
      </ContentCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import ContentCard from '~/components/ui/ContentCard.vue'
import Badge from '~/components/ui/Badge.vue'

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
  'latest-posts',
  () => queryCollection('blog').order('date', 'DESC').limit(3).all(),
  { lazy: true }
)

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getDescription = (post: any) => {
  if (post.description) {
    return post.description.length > 120 
      ? post.description.substring(0, 120) + '...' 
      : post.description
  }
  return ''
}

const getLanguageIcon = (lang: string) => {
  return languageIcons[lang.toLowerCase()] || languageIcons.other
}
</script>
