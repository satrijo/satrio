<template>
  <article class="max-w-4xl mx-auto space-y-8">
    <header class="text-center space-y-4">
      <h1 class="text-4xl font-bold">{{ project.title }}</h1>
      <time class="text-gray-500">{{ formatDate(project.date) }}</time>
      <a v-if="project.link" :href="project.link" target="_blank" rel="noopener" class="inline-block text-green-400 hover:text-green-300 transition-colors">
        View Live Demo →
      </a>
    </header>
    
    <div class="prose prose-invert max-w-none">
      <ContentRenderer :value="project" />
    </div>
    
    <div class="border-t border-gray-400 pt-8">
      <NuxtLink to="/projects" class="text-blue-400 hover:text-blue-300 transition-colors">
        ← Back to Projects
      </NuxtLink>
    </div>
  </article>
</template>

<script setup>
const route = useRoute()
const { data: project } = await useAsyncData(`project-${route.params.slug}`, () =>
  queryContent('projects', route.params.slug).findOne()
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}
</script> 