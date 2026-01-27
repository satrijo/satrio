<template>
  <UApp>
    <div class="min-h-screen flex flex-col bg-[var(--color-background)]">
      <HeaderSection />
      <main class="flex-1 py-4">
        <slot />
      </main>
      <FooterSection />
    </div>
  </UApp>
</template>

<script setup>
import HeaderSection from '~/components/HeaderSection.vue'
import FooterSection from '~/components/FooterSection.vue'
</script>
