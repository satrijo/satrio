<template>
  <article class="max-w-4xl mx-auto space-y-8">
    <header class="text-center space-y-4">
      <h1 class="text-4xl font-bold">{{ post.title }}</h1>
      <time class="text-gray-500">{{ formatDate(post.date) }}</time>
    </header>
    
    <div class="prose prose-invert max-w-none">
      <ContentRenderer :value="post" />
    </div>
    
    <div class="border-t border-gray-400 pt-8">
      <NuxtLink to="/blog" class="text-blue-400 hover:text-blue-300 transition-colors">
        ← Back to Blog
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
const route = useRoute()
const { data: post } = await useAsyncData(`blog-${route.params.slug}`, () =>
  queryContent('blog', route.params.slug).findOne()
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 