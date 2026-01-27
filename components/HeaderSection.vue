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
        
        <!-- Desktop Navigation -->
        <nav class="hidden sm:flex items-center gap-1">
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

        <!-- Mobile Menu Button -->
        <button
          @click="toggleMobileMenu"
          class="sm:hidden btn btn-ghost !p-2"
          aria-label="Toggle menu"
        >
          <Icon v-if="!isMobileMenuOpen" name="heroicons:bars-3-20-solid" class="w-6 h-6" />
          <Icon v-else name="heroicons:x-mark-20-solid" class="w-6 h-6" />
        </button>
      </div>

      <!-- Mobile Navigation -->
      <Transition name="mobile-menu">
        <nav v-if="isMobileMenuOpen" class="sm:hidden py-4 border-t border-[var(--color-border)] mt-2">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.to"
            :to="link.to" 
            class="block py-3 px-4 text-sm font-medium rounded-lg transition-colors"
            :class="{ 
              'text-[var(--color-primary)] bg-[var(--color-surface)]': isActive(link.to),
              'text-[var(--color-text-muted)] hover:text-[var(--color-text-heading)] hover:bg-[var(--color-surface)]': !isActive(link.to)
            }"
            @click="closeMobileMenu"
          >
            {{ link.label }}
          </NuxtLink>
        </nav>
      </Transition>
    </div>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isMobileMenuOpen = ref(false)

const navLinks = [
  { to: '/blog', label: 'Blog' },
  { to: '/work', label: 'Work' },
  { to: '/projects', label: 'Projects' }
]

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close menu on route change
watch(() => route.path, () => {
  closeMobileMenu()
})
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

/* Mobile menu transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.3s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
