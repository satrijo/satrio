<template>
  <div class="space-y-8">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Work Experience</h1>
      <p class="text-gray-400">My professional journey and experience.</p>
    </div>
    
    <div class="space-y-8">
      <article v-for="work in workExperiences" :key="work._path" class="border border-gray-400 p-6 rounded-lg">
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
const { data: workExperiences } = await useAsyncData('work-experiences', () =>
  queryContent('work').sort({ start_date: -1 }).find()
)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}
</script> 