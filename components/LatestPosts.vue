<template>
  <section class="section">
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Latest Posts</h2>
      <NuxtLink to="/blog" class="section-link">
        View all
        <Icon name="mdi:arrow-right" class="w-4 h-4" />
      </NuxtLink>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="posts-list">
      <div v-for="n in 3" :key="n" class="post-skeleton">
        <div class="skeleton h-4 w-3/4 mb-2"></div>
        <div class="skeleton h-3 w-full mb-2"></div>
        <div class="skeleton h-3 w-24"></div>
      </div>
    </div>
    
    <!-- Posts list -->
    <div v-else class="posts-list">
      <article 
        v-for="post in posts" 
        :key="post.path"
        class="post-item"
      >
        <NuxtLink :to="post.path" class="post-link">
          <h3 class="post-title">{{ post.title }}</h3>
          <p v-if="getDescription(post)" class="post-description">
            {{ getDescription(post) }}
          </p>
          <div class="post-meta">
            <span>{{ formatDate(post.date) }}</span>
            <template v-if="post.category">
              <span class="meta-dot">·</span>
              <span>{{ post.category }}</span>
            </template>
          </div>
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: posts, pending } = await useAsyncData(
  'latest-posts',
  () => queryCollection('blog').order('date', 'DESC').limit(3).all()
)

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
    return post.description.length > 120 
      ? post.description.substring(0, 120) + '...' 
      : post.description
  }
  return ''
}
</script>

<style scoped>
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.section-link:hover {
  color: var(--color-primary);
}

.posts-list {
  display: flex;
  flex-direction: column;
}

.post-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.post-item:last-child {
  border-bottom: none;
}

.post-link {
  display: block;
}

.post-title {
  font-family: var(--font-prose);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-heading);
  margin-bottom: 0.25rem;
  transition: color 0.15s ease;
}

.post-link:hover .post-title {
  color: var(--color-primary);
}

.post-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.meta-dot {
  color: var(--color-text-muted);
}

.post-skeleton {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}
</style>
