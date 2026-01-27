<template>
  <UApp>
    <div class="min-h-screen flex flex-col">
      <HeaderSection />
      <main class="flex-1 container-custom py-8">
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
