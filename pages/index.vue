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
      content: 'Software developer with 8+ years combining meteorology and full-stack development at BMKG. Building high-performance, real-time data systems. Proficient in Python, Laravel, Node.js, AWS, Docker.' 
    },
    { name: 'keywords', content: 'software developer, full-stack developer, BMKG, meteorology, Python, Laravel, Node.js, AWS, Docker, real-time systems' },
    { property: 'og:title', content: 'Satrio - Software Developer' },
    { property: 'og:description', content: 'Software developer with 8+ years experience building high-performance, real-time meteorological data systems at BMKG.' },
    { property: 'og:url', content: baseUrl },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:title', content: 'Satrio - Software Developer' },
    { name: 'twitter:description', content: 'Software developer with 8+ years building real-time meteorological systems. Python, Laravel, Node.js, AWS, Docker.' },
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
