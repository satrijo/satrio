<template>
  <header class="sticky top-0 z-10 bg-black/80 backdrop-blur border-b border-gray-800 mb-10 text-white">
    <div class="flex justify-between items-center py-4">
      <h1 class="text-lg font-bold tracking-tight">
        <NuxtLink to="/" class="hover:text-gray-200 transition-colors">satrio.dev</NuxtLink>
      </h1>
      <nav class="flex items-center gap-3 text-sm">
        <NuxtLink to="/blog" class="underline-link font-medium">blog</NuxtLink>
        <span class="text-gray-600">/</span>
        <NuxtLink to="/work" class="underline-link font-medium">work</NuxtLink>
        <span class="text-gray-600">/</span>
        <NuxtLink to="/projects" class="underline-link font-medium">projects</NuxtLink>
      </div>
    </div>
  </header>
</template> 