<template>
  <div class="space-y-8 text-white">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Work Experience</h1>
      <p class="text-gray-400">My professional journey and experience.</p>
    </div>
    
    <div class="space-y-8">
      <div v-if="pending" class="space-y-4">
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse border border-gray-800 p-6 rounded-lg bg-gray-900/40"
        >
          <div class="h-5 bg-gray-800 rounded w-2/3 mb-3" />
          <div class="h-4 bg-gray-800 rounded w-1/3 mb-2" />
          <div class="h-3 bg-gray-800 rounded w-full mb-1" />
          <div class="h-3 bg-gray-800 rounded w-5/6 mb-1" />
          <div class="h-3 bg-gray-800 rounded w-4/6" />
        </div>
      </div>

      <article
        v-for="work in workExperiences || []"
        :key="work._path"
        class="p-6 rounded-lg"
        v-else
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h2 class="text-xl font-bold">{{ work.position }}</h2>
            <p class="text-lg text-gray-300">{{ work.company }}</p>
          </div>
          <div class="text-right">
            <time class="text-sm text-gray-500">{{ formatDate(work.start_date) }}</time>
            <span class="text-gray-500"> - </span>
            <time v-if="work.end_date" class="text-sm text-gray-500">{{ formatDate(work.end_date) }}</time>
            <span v-else class="text-sm text-green-400">Present</span>
          </div>
        </div>
        <div class="text-gray-400 prose prose-invert max-w-none">
          <ContentRenderer :value="work" />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { useHead } from '@unhead/vue'
const { data: workExperiences, pending } = await useAsyncData(
  'work-experiences',
  async () => {
    const all = await queryCollection('work').all()
    // Sort: current (tanpa end_date) dulu, lalu berdasarkan end_date DESC
    return all.sort((a, b) => {
      if (!a.end_date && b.end_date) return -1
      if (a.end_date && !b.end_date) return 1
      if (!a.end_date && !b.end_date) return new Date(b.start_date) - new Date(a.start_date)
      return new Date(b.end_date) - new Date(a.end_date)
    })
  },
  {
    lazy: true
  }
)

const baseUrl = 'https://satrio.dev'

useHead({
  title: 'Work Experience | Satrio - Professional Journey',
  meta: [
    { 
      name: 'description', 
      content: 'Professional journey, work experience, and career history of Satrio. Full-Stack Engineer at BMKG and Lead Developer at Open Knowledge Association.' 
    },
    { name: 'keywords', content: 'work experience, career, professional history, software engineer, developer' },
    { property: 'og:title', content: 'Work Experience | Satrio - Professional Journey' },
    { property: 'og:description', content: 'Professional journey, work experience, and career history of Satrio.' },
    { property: 'og:url', content: `${baseUrl}/work` },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: 'Work Experience | Satrio' },
    { name: 'twitter:description', content: 'Professional journey, work experience, and career history of Satrio.' }
  ],
  link: [
    { rel: 'canonical', href: `${baseUrl}/work` }
  ]
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}
</script> 