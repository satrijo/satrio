<template>
  <div class="related-articles">
    <h3 class="related-title">Artikel Terkait</h3>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="related-grid">
      <div v-for="n in 3" :key="n" class="related-card-skeleton">
        <div class="skeleton h-3 w-20 mb-2"></div>
        <div class="skeleton h-4 w-full"></div>
      </div>
    </div>
    
    <!-- Related articles -->
    <div v-else-if="displayArticles.length > 0" class="related-grid">
      <NuxtLink
        v-for="article in displayArticles"
        :key="article.path || article.slug"
        :to="article.path || `/blog/${article.slug}`"
        class="related-card"
      >
        <span class="related-category">{{ article.category }}</span>
        <h4 class="related-card-title">{{ article.title }}</h4>
      </NuxtLink>
    </div>
    
    <!-- Empty state -->
    <p v-else class="text-muted">Tidak ada artikel terkait.</p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPost: any
  allPosts: any[]
  pending?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pending: false
})

// Use allPosts directly - the API already returns filtered related articles
// No need to run through getRelatedArticles() again
const displayArticles = computed(() => {
  if (!props.allPosts?.length) return []
  
  // Filter out current post if it somehow got included
  const currentSlug = props.currentPost?.slug
  return props.allPosts
    .filter(article => article.slug !== currentSlug)
    .slice(0, 5)
})
</script>

<style scoped>
.related-articles {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.related-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-heading);
  margin-bottom: 1rem;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.related-card {
  display: block;
  padding: 1rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
  transition: all 0.15s ease;
}

.related-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-2px);
}

.related-category {
  display: inline-block;
  font-size: 0.75rem;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.related-card-title {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-text-heading);
  line-height: 1.4;
}

.related-card-skeleton {
  padding: 1rem;
  background-color: var(--color-surface);
  border-radius: var(--radius-card);
  border: 1px solid var(--color-border);
}

@media (max-width: 640px) {
  .related-grid {
    grid-template-columns: 1fr;
  }
}
</style>
