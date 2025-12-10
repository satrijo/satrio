<template>
  <div class="space-y-8 text-white">
    <div class="text-center">
      <h1 class="text-3xl font-bold mb-4">Projects</h1>
      <p class="text-gray-400">A collection of my work and projects.</p>
    </div>

    <div class="space-y-6">
      <div v-if="pending" class="space-y-4">
        <div
          v-for="n in 3"
          :key="n"
          class="animate-pulse border border-gray-800 p-6 rounded-lg bg-gray-900/40"
        >
          <div class="h-5 bg-gray-800 rounded w-2/3 mb-3" />
          <div class="h-3 bg-gray-800 rounded w-1/2 mb-2" />
          <div class="h-3 bg-gray-800 rounded w-full mb-1" />
          <div class="h-3 bg-gray-800 rounded w-4/5" />
        </div>
      </div>

      <div
        v-for="project in projects || []"
        :key="project._path"
        class="group border border-gray-800 p-6 rounded-lg shadow-md hover:bg-gray-700 hover:text-white transition-colors duration-300 cursor-pointer"
        @click="navigateTo(project.path)"
        v-else
      >
        <div class="flex justify-between items-center">
          <div>
            <h3 class="font-bold">{{ project.title }}</h3>
            <span
              class="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed transition-colors duration-300"
            >
              {{
                project.description
                  ? project.description.substring(0, 150) + "..."
                  : ""
              }}
            </span>
          </div>
          <div class="relative w-6 h-6 flex-shrink-0">
            <div
              class="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0"
            >
              <Icon name="ep:arrow-right" class="w-6 h-6" />
            </div>
            <div
              class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
            >
              <Icon name="line-md:arrow-right-circle" class="w-6 h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { data: projects, pending } = await useAsyncData(
  "projects",
  () => queryCollection("projects").order("date", "DESC").all(),
  {
    lazy: true,
  },
);

const baseUrl = "https://satrio.dev";

useHead({
  title: "Projects | Satrio - Portfolio & Work Showcase",
  meta: [
    {
      name: "description",
      content:
        "A collection of Satrio's work, portfolio, and projects. Full-stack web applications built with modern technologies.",
    },
    {
      name: "keywords",
      content:
        "portfolio, projects, web development, software projects, full-stack development",
    },
    {
      property: "og:title",
      content: "Projects | Satrio - Portfolio & Work Showcase",
    },
    {
      property: "og:description",
      content: "A collection of Satrio's work, portfolio, and projects.",
    },
    { property: "og:url", content: `${baseUrl}/projects` },
    { property: "og:type", content: "website" },
    { property: "og:image", content: `${baseUrl}/og-image.jpg` },
    { name: "twitter:card", content: "summary" },
    { name: "twitter:image", content: `${baseUrl}/og-image.jpg` },
    { name: "twitter:title", content: "Projects | Satrio" },
    {
      name: "twitter:description",
      content: "A collection of Satrio's work, portfolio, and projects.",
    },
  ],
  link: [{ rel: "canonical", href: `${baseUrl}/projects` }],
});

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  });
};
</script>
