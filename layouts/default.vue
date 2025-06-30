<template>
  <UApp>
    <HeaderSection />
    <main>
      <slot />
    </main>
    <FooterSection />
  </UApp>
</template>

<script setup>
import HeaderSection from '~/components/HeaderSection.vue'
import FooterSection from '~/components/FooterSection.vue'
</script> 