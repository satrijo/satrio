<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Blog</h1>
      <p class="text-gray-400">Thoughts, ideas, and insights about technology and development.</p>
    </div>

    <div class="space-y-6">
      <article v-for="post in posts" :key="post._path"
        class="border border-gray-400 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300 cursor-pointer group">
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold">{{ post.title }}</h3>
            <p class="text-gray-500 group-hover:text-gray-300 text-sm transition-colors duration-300">
              {{ post.body.value[0][2].substring(0, 150) }}...</p>
          </div>
          <div class="relative w-6 h-6">
            <div class="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
              <Icon name="ep:arrow-right" class="w-6 h-6" />
            </div>
            <div class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <Icon name="line-md:arrow-right-circle" class="w-6 h-6" />
            </div>
          </div>
        </div>
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

const { data: posts } = await useAsyncData('blog', () =>
  queryCollection('blog').all()
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>