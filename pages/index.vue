<template>
  <main class="space-y-16 mt-16 text-white">
    <HeroSection />
    <LatestPosts />
    <WorkExperience />
    <RecentProjects />
    <ConnectSection />
  </main>
</template>

<script setup>
import { useHead } from '@unhead/vue'
import HeroSection from '~/components/HeroSection.vue'
import LatestPosts from '~/components/LatestPosts.vue'
import WorkExperience from '~/components/WorkExperience.vue'
import RecentProjects from '~/components/RecentProjects.vue'
import ConnectSection from '~/components/ConnectSection.vue'

useHead({
  title: 'Home | Satrio',
  meta: [
    { name: 'description', content: 'Personal website and portfolio of Satrio. Web developer, projects, blog, and more.' }
  ]
})
</script>
