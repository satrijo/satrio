<template>
  <section class="hero-section">
    <!-- Avatar & Name -->
    <div class="hero-header">
      <img 
        src="https://ui-avatars.com/api/?name=Satrio&background=1E293B&color=38BDF8&size=72"
        alt="Satrio"
        class="hero-avatar"
      />
      <div class="hero-name-wrap">
        <h1 class="hero-name">Satrio</h1>
        <p class="hero-title">Full-Stack Engineer</p>
      </div>
    </div>
    
    <!-- Bio -->
    <div class="hero-bio">
      <p>
        Software developer with 8+ years of experience combining meteorology and full-stack 
        development at BMKG. Building high-performance, real-time data systems for aviation 
        and public safety.
      </p>
      <p>
        Proficient in Python, Laravel, Node.js, AWS, and Docker.
      </p>
    </div>
    
    <!-- Social Links -->
    <div class="hero-social">
      <a 
        v-for="social in socialLinks"
        :key="social.href"
        :href="social.href"
        :target="social.external ? '_blank' : undefined"
        :rel="social.external ? 'noopener noreferrer' : undefined"
        class="social-link"
        :title="social.label"
      >
        <Icon :name="social.icon" class="w-5 h-5" />
        <span>{{ social.label }}</span>
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
const socialLinks = [
  { 
    href: 'https://github.com/satrijo', 
    icon: 'mdi:github',
    label: 'GitHub',
    external: true
  },
  { 
    href: 'https://www.linkedin.com/in/satriyounggulwicaksono/', 
    icon: 'mdi:linkedin',
    label: 'LinkedIn',
    external: true
  },
  { 
    href: 'https://www.threads.net/@lensatrio', 
    icon: 'simple-icons:threads',
    label: 'Threads',
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
.hero-section {
  padding-top: 1rem;
}

.hero-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hero-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
}

.hero-name-wrap {
  display: flex;
  flex-direction: column;
}

.hero-name {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-heading);
  line-height: 1.2;
}

.hero-title {
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.hero-bio {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.hero-bio p {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-body);
}

.hero-social {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  border: 1px solid var(--color-border);
  border-radius: 9999px;
  transition: all 0.15s ease;
}

.social-link:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
</style>
