<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Projects</h1>
      <p class="text-gray-400">A collection of my work and projects.</p>
    </div>
    
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <article v-for="project in projects" :key="project._path" class="border border-gray-400 p-6 rounded-lg hover:bg-gray-700 transition-colors duration-300">
        <div class="flex justify-between items-start mb-4">
          <h2 class="text-xl font-bold">{{ project.title }}</h2>
          <time class="text-sm text-gray-500">{{ formatDate(project.date) }}</time>
        </div>
        <p class="text-gray-400 mb-4">{{ project.body }}</p>
        <div class="flex justify-between items-center">
          <NuxtLink :to="project._path" class="text-blue-400 hover:text-blue-300 transition-colors">
            View details →
          </NuxtLink>
          <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="text-green-400 hover:text-green-300 transition-colors">
            Live demo →
          </a>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
const { data: projects } = await useAsyncData('projects', () =>
  queryContent('projects').sort({ date: -1 }).find()
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}
</script> 