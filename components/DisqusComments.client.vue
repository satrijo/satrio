<template>
  <section class="mt-16" ref="commentSection">
    <h3 class="text-xl font-bold mb-4">Komentar</h3>
    
    <!-- Show loading placeholder until Disqus is loaded -->
    <div v-if="!isLoaded" class="rounded-xl p-6 min-h-[200px] bg-gray-800 border border-gray-600 flex items-center justify-center">
      <div class="text-gray-400 text-center">
        <div v-if="isVisible" class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white mx-auto mb-2"></div>
        <p v-else>Scroll untuk memuat komentar...</p>
      </div>
    </div>
    
    <div id="disqus_thread" class="rounded-xl p-6 min-h-[200px]" v-show="isLoaded"></div>
    <noscript>
      Please enable JavaScript to view the
      <a href="https://disqus.com/?ref_noscript">comments powered by Disqus.</a>
    </noscript>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  identifier?: string;
  title?: string;
}>();

const commentSection = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const isLoaded = ref(false);

// Use Intersection Observer for lazy loading
onMounted(() => {
  if (!commentSection.value) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !isLoaded.value) {
          isVisible.value = true;
          loadDisqus();
          observer.disconnect();
        }
      });
    },
    {
      rootMargin: '200px', // Start loading 200px before element is visible
      threshold: 0
    }
  );

  observer.observe(commentSection.value);

  onUnmounted(() => {
    observer.disconnect();
  });
});

const loadDisqus = () => {
  const disqus_config = function (this: any) {
    this.page.url = window.location.href;
    this.page.identifier = props.identifier || window.location.pathname;
  };

  // @ts-ignore
  window.disqus_config = disqus_config;

  const d = document;
  const s = d.createElement('script');
  s.src = 'https://satriodev-1.disqus.com/embed.js';
  s.setAttribute('data-timestamp', String(+new Date()));
  s.onload = () => {
    isLoaded.value = true;
  };
  (d.head || d.body).appendChild(s);
};
</script>
