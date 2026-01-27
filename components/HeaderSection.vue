<template>
  <header class="header-medium">
    <div class="header-container">
      <!-- Logo / Brand -->
      <NuxtLink 
        to="/" 
        class="header-brand"
      >
        satrio.dev
      </NuxtLink>
      
      <!-- Desktop Navigation -->
      <nav class="header-nav">
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
        class="mobile-menu-btn"
        aria-label="Toggle menu"
      >
        <Icon v-if="!isMobileMenuOpen" name="heroicons:bars-3-20-solid" class="w-6 h-6" />
        <Icon v-else name="heroicons:x-mark-20-solid" class="w-6 h-6" />
      </button>
    </div>

    <!-- Mobile Navigation -->
    <Transition name="mobile-menu">
      <nav v-if="isMobileMenuOpen" class="mobile-nav">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.to"
          :to="link.to" 
          class="mobile-nav-link"
          :class="{ 'mobile-nav-link-active': isActive(link.to) }"
          @click="closeMobileMenu"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>
    </Transition>
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
.header-medium {
  position: sticky;
  top: 0;
  z-index: 50;
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.header-container {
  max-width: 1192px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 57px;
}

.header-brand {
  font-size: 1.375rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: var(--color-text-heading);
  transition: color 0.15s ease;
}

.header-brand:hover {
  color: var(--color-primary);
}

/* Desktop Navigation */
.header-nav {
  display: none;
  align-items: center;
  gap: 2rem;
}

@media (min-width: 640px) {
  .header-nav {
    display: flex;
  }
}

.nav-link {
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
  padding: 0.5rem 0;
  position: relative;
}

.nav-link:hover {
  color: var(--color-text-heading);
}

.nav-link-active {
  color: var(--color-text-heading);
}

.nav-link-active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 1px;
  background-color: var(--color-text-heading);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.mobile-menu-btn:hover {
  color: var(--color-text-heading);
}

@media (min-width: 640px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* Mobile Navigation */
.mobile-nav {
  padding: 1rem 1.5rem 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.mobile-nav-link {
  padding: 0.75rem 1rem;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  border-radius: 0.5rem;
  transition: all 0.15s ease;
}

.mobile-nav-link:hover {
  color: var(--color-text-heading);
  background-color: var(--color-surface);
}

.mobile-nav-link-active {
  color: var(--color-text-heading);
  background-color: var(--color-surface);
}

/* Mobile menu transition */
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.2s ease;
}

.mobile-menu-enter-from {
  opacity: 0;
  transform: translateY(-0.5rem);
}

.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}
</style>
