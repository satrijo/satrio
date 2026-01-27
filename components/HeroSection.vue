<template>
  <section class="py-8">
    <!-- Greeting with subtle accent -->
    <div class="mb-8">
      <p class="text-[var(--color-primary)] text-sm font-medium mb-2">
        Hello, I'm
      </p>
      <h1 class="text-heading text-4xl sm:text-5xl font-bold mb-4">
        Satriyo
        <span class="inline-block animate-wave origin-[70%_70%]">👋🏻</span>
      </h1>
      <p class="text-[var(--color-accent)] text-lg font-medium">
        Full-Stack Engineer & Lead Developer
      </p>
    </div>
    
    <!-- Bio paragraphs -->
    <div class="space-y-4 max-w-2xl">
      <p class="text-body leading-relaxed">
        Full-Stack Engineer with over three years of experience at Indonesia's national 
        meteorological agency <span class="text-heading font-medium">(BMKG)</span> and currently 
        serving as the Lead Software Developer for the 
        <span class="text-heading font-medium">Open Knowledge Association (OKA)</span>.
      </p>
      
      <p class="text-body leading-relaxed">
        My core competency is building scalable, high-performance web applications using 
        a diverse technology stack, including 
        <span class="text-[var(--color-primary)]">Python</span>, 
        <span class="text-[var(--color-primary)]">PHP</span>, 
        <span class="text-[var(--color-primary)]">Node.js</span>, and 
        <span class="text-[var(--color-primary)]">Ruby on Rails</span>. 
        I have a strong passion for bridging Earth Science data with efficient software solutions.
      </p>
      
      <p class="text-body leading-relaxed">
        In addition to backend roles, I am experienced in modern frontends 
        (JavaScript, React, Vue) and dedicated to UX principles.
      </p>
    </div>
    
    <!-- Tech stack badges -->
    <div class="flex flex-wrap gap-2 mt-6">
      <span 
        v-for="tech in techStack" 
        :key="tech"
        class="badge badge-surface"
      >
        {{ tech }}
      </span>
    </div>
  </section>
</template>

<script setup lang="ts">
const techStack = [
  'Python',
  'PHP',
  'Node.js',
  'TypeScript',
  'Vue.js',
  'React',
  'Laravel',
  'PostgreSQL'
]
</script>

<style scoped>
@keyframes wave {
  0%, 100% { transform: rotate(0deg); }
  25% { transform: rotate(20deg); }
  75% { transform: rotate(-10deg); }
}

.animate-wave {
  animation: wave 2s ease-in-out infinite;
  display: inline-block;
}
</style>
