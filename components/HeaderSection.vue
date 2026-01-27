<template>
  <header class="sticky top-0 z-50 bg-[var(--color-background)]/95 backdrop-blur-md border-b border-[var(--color-border)]">
    <div class="container-custom">
      <div class="flex justify-between items-center h-16">
        <!-- Logo / Brand -->
        <NuxtLink 
          to="/" 
          class="text-heading text-lg font-bold tracking-tight hover:text-[var(--color-primary)] transition-colors"
        >
          satrio.dev
        </NuxtLink>
        
        <!-- Navigation -->
        <nav class="flex items-center gap-1">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.to"
            :to="link.to" 
            class="nav-link"
            :class="{ 'nav-link-active': isActive(link.to) }"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()

const navLinks = [
  { to: '/blog', label: 'Blog' },
  { to: '/work', label: 'Work' },
  { to: '/projects', label: 'Projects' }
]

const isActive = (path: string) => {
  return route.path.startsWith(path)
}
</script>

<style scoped>
.nav-link {
  padding: 0.5rem 0.875rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-muted);
  border-radius: var(--radius-button);
  transition: all var(--transition-fast);
}

.nav-link:hover {
  color: var(--color-text-heading);
  background-color: var(--color-surface);
}

.nav-link-active {
  color: var(--color-primary);
  background-color: rgba(56, 189, 248, 0.1);
}
</style>
