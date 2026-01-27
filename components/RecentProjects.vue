<template>
  <section>
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Recent Projects</h2>
      <NuxtLink to="/projects" class="link-primary text-sm font-medium flex items-center gap-1">
        View all
        <Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4" />
      </NuxtLink>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="grid sm:grid-cols-2 gap-4">
      <SkeletonCard v-for="n in 2" :key="n" />
    </div>
    
    <!-- Projects grid -->
    <div v-else class="grid sm:grid-cols-2 gap-4">
       <ContentCard
         v-for="project in projects"
         :key="project._path"
         :title="project.title"
         :description="getDescription(project)"
         :date="formatDate(project.date)"
         :to="project._path"
       >
        <template #meta>
          <span class="flex items-center gap-1">
            <Icon name="mdi:calendar-outline" class="w-3.5 h-3.5" />
            {{ formatDate(project.date) }}
          </span>
          <span v-if="project.link" class="flex items-center gap-1 text-[var(--color-primary)]">
            <Icon name="mdi:link-variant" class="w-3.5 h-3.5" />
            Live
          </span>
        </template>
      </ContentCard>
    </div>
  </section>
</template>

<script setup lang="ts">
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import ContentCard from '~/components/ui/ContentCard.vue'

const { data: projects, pending } = await useAsyncData(
  'recent-projects',
  () => queryCollection('projects').order('date', 'DESC').limit(2).all(),
  { lazy: true }
)

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

const getDescription = (project: any) => {
  if (project.description) {
    return project.description.length > 100 
      ? project.description.substring(0, 100) + '...' 
      : project.description
  }
  return ''
}
</script>
