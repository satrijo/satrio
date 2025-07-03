
<template>
  <div class="text-white">
    <div v-if="pending" class="flex justify-center items-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"></div>
    </div>
    <article v-else-if="project" class="max-w-4xl mx-auto space-y-10 rounded-2xl shadow-2xl p-8 border border-gray-800">
      <header class="text-center space-y-3">
        <h1 class="text-4xl sm:text-5xl font-extrabold text-gray-100 mb-2 drop-shadow-lg">{{ project.title }}</h1>
        <time class="text-gray-500 text-sm flex items-center justify-center gap-2">
          <Icon name="mdi:calendar" class="w-4 h-4" />
          {{ formatDate(project.date) }}
        </time>
        <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="inline-block mt-2 px-4 py-2 bg-gray-800 text-gray-200 border border-gray-600 rounded-full font-semibold hover:bg-gray-700 hover:text-white transition-colors">
          <Icon name="mdi:laptop" class="w-5 h-5 inline-block mr-1" /> View Live Demo
        </a>
      </header>
      <div class="prose prose-invert prose-lg max-w-none mx-auto bg-gray-900/80 rounded-xl p-6 shadow-inner">
        <ContentRenderer :value="project" />
      </div>
      <div class="flex justify-between items-center border-t border-gray-800 pt-8 mt-8">
        <NuxtLink to="/projects" class="text-gray-300 hover:text-white transition-colors flex items-center gap-1">
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          Back to Projects
        </NuxtLink>
        <span class="text-xs text-gray-600">Project Detail</span>
      </div>
    </article>
    <div v-else class="text-center py-20 text-red-400">
      <h2 class="text-2xl font-bold mb-4">Project not found</h2>
      <NuxtLink to="/projects" class="text-blue-400 hover:text-blue-300 transition-colors">
        ← Back to Projects
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
const route = useRoute()
const { data: project, pending } = await useAsyncData(route.path, () => {
  return queryCollection('projects').path(route.path).first()
})

watchEffect(() => {
  if (project.value) {
    useHead({
      title: project.value.title,
      meta: [
        { name: 'description', content: project.value.description || '' },
        { property: 'og:title', content: project.value.title },
        { property: 'og:description', content: project.value.description || '' },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: typeof window !== 'undefined' ? window.location.href : '' },
        { name: 'twitter:card', content: 'summary' },
        { name: 'twitter:title', content: project.value.title },
        { name: 'twitter:description', content: project.value.description || '' },
      ]
    })
  }
})

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}
</script>