<template>
  <footer class="footer-medium">
    <div class="footer-container">
      <!-- Links -->
      <div class="footer-links">
        <span class="footer-copyright">© {{ new Date().getFullYear() }} Satrio</span>
        <NuxtLink to="/blog" class="footer-link">Blog</NuxtLink>
        <NuxtLink to="/work" class="footer-link">Work</NuxtLink>
        <NuxtLink to="/projects" class="footer-link">Projects</NuxtLink>
      </div>

      <!-- Social -->
      <div class="footer-social">
        <a 
          v-for="social in socialLinks"
          :key="social.href"
          :href="social.href"
          :target="social.external ? '_blank' : undefined"
          :rel="social.external ? 'noopener noreferrer' : undefined"
          class="footer-social-link"
          :title="social.label"
        >
          <Icon :name="social.icon" class="w-5 h-5" />
        </a>
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

<style scoped>
.footer-medium {
  border-top: 1px solid var(--color-border);
  margin-top: auto;
}

.footer-container {
  max-width: 1192px;
  margin: 0 auto;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 640px) {
  .footer-container {
    flex-direction: column;
    gap: 1rem;
  }
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.footer-link {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.footer-link:hover {
  color: var(--color-text-heading);
}

.footer-copyright {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.footer-social {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.footer-social-link {
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.footer-social-link:hover {
  color: var(--color-text-heading);
}
</style>
