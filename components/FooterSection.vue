<template>
  <footer class="border-t border-[var(--color-border)] mt-auto">
    <div class="container-custom py-8">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
        <!-- Copyright -->
        <div class="text-muted text-sm">
          <p>{{ new Date().getFullYear() }} Satrio.dev</p>
        </div>
        
        <!-- Social links -->
        <div class="flex items-center gap-4">
          <a 
            v-for="social in socialLinks"
            :key="social.href"
            :href="social.href"
            :target="social.external ? '_blank' : undefined"
            :rel="social.external ? 'noopener noreferrer' : undefined"
            class="text-muted hover:text-[var(--color-primary)] transition-colors"
            :title="social.label"
          >
            <Icon :name="social.icon" class="w-5 h-5" />
          </a>
        </div>
        
        <!-- Tagline -->
        <div class="text-muted text-sm">
          <p>Built with <span class="text-[var(--color-accent)]">Nuxt</span></p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const socialLinks = [
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
