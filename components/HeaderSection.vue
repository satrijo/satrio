<template>
  <header class="sticky top-0 z-10 bg-black mb-10">
    <div class="flex justify-between items-center py-4">
      <h1 class="text-lg font-bold">
        <NuxtLink to="/">satrio.dev</NuxtLink>
      </h1>
      <div class="flex items-center gap-2 cursor-pointer">
        <NuxtLink to="/blog" class="underline-link">blog</NuxtLink> /
        <NuxtLink to="/work" class="underline-link">work</NuxtLink> /
        <NuxtLink to="/projects" class="underline-link">projects</NuxtLink>
      </div>
    </div>
  </header>
</template> 