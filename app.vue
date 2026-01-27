<template>
  <div>
    <!-- Global Loading Indicator -->
    <Transition name="fade">
      <div 
        v-if="isNavigating" 
        class="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-accent)] to-[var(--color-primary)] animate-pulse"
        style="animation: shimmer 1.5s ease-in-out infinite"
      />
    </Transition>

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup>
import { useHead } from "#imports";
const route = useRoute();
const config = useRuntimeConfig();

// Navigation loading state
const isNavigating = ref(false);

// Listen to navigation events
const router = useRouter();
router.beforeEach(() => {
  isNavigating.value = true;
});

router.afterEach(() => {
  setTimeout(() => {
    isNavigating.value = false;
  }, 300);
});

// Base URL untuk canonical dan og:url
const baseUrl = "https://satrio.dev";
const currentUrl = computed(() => `${baseUrl}${route.path}`);

useHead({
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: "w-full max-w-screen-lg mx-auto px-6 py-4 bg-gray-900",
  },
  link: [
    {
      rel: "canonical",
      href: currentUrl,
    },
  ],
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
