<template>
    <section class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="font-bold">Work Experience</h2>
            <NuxtLink to="/work" class="underline-link">See all work</NuxtLink>
        </div>
        <div class="w-full space-y-7 text-gray-400">
            <div v-for="work in workExperience" :key="work._path" class="py-1">
                <div class="mb-3 text-sm">
                    <span>{{ formatDateRange(work.start_date, work.end_date) }}</span>
                    <h3 class="font-bold text-base">{{ work.company }}</h3>
                    <span>{{ work.position }}</span>
                </div>
                <div class="prose prose-invert max-w-none">
                    <ContentRenderer :value="work" />
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const { data: workExperience } = await useAsyncData('work-experience', async () => {
  const all = await queryCollection('work').all()
  // Sort: current (tanpa end_date) dulu, lalu berdasarkan end_date DESC
  return all
    .sort((a, b) => {
      if (!a.end_date && b.end_date) return -1
      if (a.end_date && !b.end_date) return 1
      if (!a.end_date && !b.end_date) return new Date(b.start_date) - new Date(a.start_date)
      return new Date(b.end_date) - new Date(a.end_date)
    })
    .slice(0, 3)
})

const formatDateRange = (startDate, endDate) => {
  if (!startDate) return ''
  const start = new Date(startDate)
  const startFormatted = start.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
  if (!endDate) {
    return `${startFormatted} - Current`
  }
  const end = new Date(endDate)
  const endFormatted = end.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
  return `${startFormatted} - ${endFormatted}`
}
</script>