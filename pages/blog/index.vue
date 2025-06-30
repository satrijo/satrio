<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Blog</h1>
      <p class="text-gray-400">Thoughts, ideas, and insights about technology and development.</p>
    </div>
    
    <div class="space-y-6">
      <article v-for="post in posts" :key="post._path" class="border border-gray-400 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300">
        <div class="flex justify-between items-start mb-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span v-if="post.programming_language">
                <Icon :name="languageIcons[post.programming_language] || languageIcons.other" class="w-5 h-5" />
              </span>
              <span v-if="post.article_language === 'indonesian'">🇮🇩</span>
              <span v-else-if="post.article_language === 'english'">🇬🇧</span>
              <span v-if="post.category" class="ml-2 text-xs text-blue-400">{{ post.category }}</span>
            </div>
            <h2 class="text-xl font-bold">
              <NuxtLink :to="post._path" class="hover:text-gray-300 transition-colors">
                {{ post.title }}
              </NuxtLink>
            </h2>
          </div>
          <time class="text-sm text-gray-500">{{ formatDate(post.date) }}</time>
        </div>
        <p class="text-gray-400 line-clamp-3">{{ post.body }}</p>
        <NuxtLink :to="post._path" class="inline-block mt-4 text-blue-400 hover:text-blue-300 transition-colors">
          Read more →
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup>
const languageIcons = {
  javascript: 'logos:javascript',
  python: 'logos:python',
  php: 'logos:php',
  typescript: 'logos:typescript-icon',
  go: 'logos:go',
  java: 'logos:java',
  other: 'mdi:code-tags'
}

const { data: posts } = await useAsyncData('blog-posts', () =>
  queryContent('blog').sort({ date: -1 }).find()
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script> 