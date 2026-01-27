<template>
  <main class="home-page">
    <HeroSection />
    <LatestPosts />
    <WorkExperience />
    <RecentProjects />
    <ConnectSection />
  </main>
</template>

<style scoped>
.home-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  padding-top: 2rem;
  padding-bottom: 4rem;
}
</style>

<script setup>
import HeroSection from '~/components/HeroSection.vue'
import LatestPosts from '~/components/LatestPosts.vue'
import WorkExperience from '~/components/WorkExperience.vue'
import RecentProjects from '~/components/RecentProjects.vue'
import ConnectSection from '~/components/ConnectSection.vue'

const baseUrl = 'https://satrio.dev'

useHead({
  title: 'Satrio - Full-Stack Engineer & Lead Developer',
  meta: [
    { 
      name: 'description', 
      content: 'Full-Stack Engineer with over three years of experience at Indonesia\'s national meteorological agency (BMKG) and currently serving as the Lead Software Developer for the Open Knowledge Association (OKA). Portfolio, blog, and projects.' 
    },
    { name: 'keywords', content: 'full-stack developer, web developer, software engineer, portfolio, blog, Python, PHP, Node.js, React, Laravel' },
    { property: 'og:title', content: 'Satrio - Full-Stack Engineer & Lead Developer' },
    { property: 'og:description', content: 'Full-Stack Engineer with over three years of experience. Portfolio, blog, and projects showcasing web development expertise.' },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:title', content: 'Satrio - Full-Stack Engineer & Lead Developer' },
    { name: 'twitter:description', content: 'Full-Stack Engineer with over three years of experience. Portfolio, blog, and projects.' },
    { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` }
  ],
  link: [
    { rel: 'canonical', href: baseUrl }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Satrio',
        url: baseUrl,
        jobTitle: 'Full-Stack Engineer & Lead Software Developer',
        worksFor: {
          '@type': 'Organization',
          name: 'Open Knowledge Association (OKA)'
        },
        sameAs: [
          'https://www.threads.net/@lensatrio',
          'https://www.linkedin.com/in/satriyounggulwicaksono/'
        ],
        email: 'mail@satrio.dev'
      })
    }
  ]
})
</script>
