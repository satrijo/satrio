<template>
  <main class="space-y-16 mt-16">
    <HeroSection />
    <LatestPosts />
    <WorkExperience />
    <RecentProjects />
    <ConnectSection />
  </main>
</template>

<script setup>
import HeroSection from '~/components/HeroSection.vue'
import LatestPosts from '~/components/LatestPosts.vue'
import WorkExperience from '~/components/WorkExperience.vue'
import RecentProjects from '~/components/RecentProjects.vue'
import ConnectSection from '~/components/ConnectSection.vue'
</script>
