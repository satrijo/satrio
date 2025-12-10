<template>
  <section class="mt-16">
    <h3 class="text-xl font-bold mb-4">Komentar</h3>
    <div
      id="disqus_thread"
      class="border border-gray-600 rounded-xl bg-white p-6 min-h-[200px]"
    ></div>
    <noscript
      >Please enable JavaScript to view the
      <a href="https://disqus.com/?ref_noscript"
        >comments powered by Disqus.</a
      ></noscript
    >
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  identifier?: string;
  title?: string;
}>();

onMounted(() => {
  var disqus_config = function () {
    this.page.url = window.location.href;
    this.page.identifier = props.identifier || window.location.pathname;
  };

  (function () {
    var d = document,
      s = d.createElement("script");
    s.src = "https://satriodev-1.disqus.com/embed.js";
    s.setAttribute("data-timestamp", +new Date());
    (d.head || d.body).appendChild(s);
  })();
});
</script>
