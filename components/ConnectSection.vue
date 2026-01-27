<template>
  <section class="surface-card p-6 sm:p-8">
    <h2 class="section-title mb-4">Let's Connect</h2>
    
    <p class="text-body leading-relaxed mb-6 max-w-xl">
      Got a project in mind or just want to say hello? Feel free to reach out through 
      social media or drop me an email. I'm always open to discussing new opportunities 
      and interesting ideas.
    </p>
    
    <!-- Contact links -->
    <div class="flex flex-wrap gap-3">
      <a
        v-for="link in contactLinks"
        :key="link.href"
        :href="link.href"
        :target="link.external ? '_blank' : undefined"
        :rel="link.external ? 'noopener noreferrer' : undefined"
        class="btn btn-ghost"
      >
        <Icon :name="link.icon" class="w-5 h-5" />
        {{ link.label }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
const contactLinks = [
  {
    href: 'https://www.threads.net/@lensatrio',
    icon: 'simple-icons:threads',
    label: 'Threads',
    external: true
  },
  {
    href: 'https://www.linkedin.com/in/satriyounggulwicaksono/',
    icon: 'mdi:linkedin',
    label: 'LinkedIn',
    external: true
  },
  {
    href: 'https://github.com/satrijo',
    icon: 'mdi:github',
    label: 'GitHub',
    external: true
  },
  {
    href: 'mailto:mail@satrio.dev',
    icon: 'mdi:email-outline',
    label: 'Email',
    external: false
  }
]
</script>
