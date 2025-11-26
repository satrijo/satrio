<template>
  <div class="space-y-8 text-white">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Blog</h1>
      <p class="text-gray-400">Thoughts, ideas, and insights about technology and development.</p>
    </div>

    <div class="space-y-6">
      <div v-if="pending" class="space-y-4">
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse border border-gray-800 p-6 rounded-lg bg-gray-900/40"
        >
          <div class="h-5 bg-gray-800 rounded w-2/3 mb-3" />
          <div class="h-3 bg-gray-800 rounded w-1/3 mb-2" />
          <div class="h-3 bg-gray-800 rounded w-full mb-1" />
          <div class="h-3 bg-gray-800 rounded w-5/6" />
        </div>
      </div>

      <NuxtLink 
        v-for="post in posts || []" 
        :key="post._path"
        :to="post.path"
        class="block border border-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer group"
        v-else
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold">{{ post.title }}</h3>
            <div class="text-xs text-gray-500 group-hover:text-gray-400 mb-3 flex flex-wrap items-center gap-1">
              <Icon name="mdi:calendar" class="w-3 h-3" />
              {{ formatDate(post.date) }}
              <Icon v-if="post.article_language === 'indonesian'" name="circle-flags:id" class="ml-2 w-3 h-3 items-center" />
              <Icon v-else-if="post.article_language === 'english'" name="circle-flags:uk" class="ml-2 w-3 h-3 items-center" />
              <Icon :name="languageIcons[post.programming_language.toLowerCase()] || languageIcons.other" class="w-3 h-3 items-center" />
              <Icon v-if="post.ai_generated === 'ai'" name="openmoji:robot" class="w-5 h-5 items-center" />
              <Icon v-else-if="post.ai_generated === 'human'" name="openmoji:account" class="w-5 h-5 items-center" />
              <Icon v-else-if="post.ai_generated === 'hybrid'" name="openmoji:handshake" class="w-5 h-5 items-center" />
            </div>
            <p class="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
              {{ post.description.substring(0, 150) + '...' || (post.body && post.body.value ? post.body.value[0][2].substring(0, 150) + '...' : '') }}</p>
          </div>
          <div class="relative w-6 h-6 flex-shrink-0">
            <div class="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
              <Icon name="ep:arrow-right" class="w-6 h-6" />
            </div>
            <div class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <Icon name="line-md:arrow-right-circle" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
// SEO metadata
useHead({
  title: 'Blog | Satrio',
  meta: [
    { name: 'description', content: 'Articles and tutorials about web development, programming, and technology.' }
  ]
})

const languageIcons = {
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
  () => queryCollection('blog').all(),
  {
    lazy: true
  }
)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>