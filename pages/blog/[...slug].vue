<template>
  <div
    v-if="pending"
    class="flex justify-center items-center min-h-[60vh] text-white mx-auto"
  >
    <div
      class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"
    ></div>
  </div>

  <div v-else-if="!post" class="max-w-4xl mx-auto py-12 text-center">
    <h1 class="text-3xl font-bold text-white mb-4">Artikel tidak ditemukan</h1>
    <p class="mb-6">Maaf, artikel yang Anda cari tidak tersedia.</p>
    <NuxtLink
      to="/blog"
      class="text-blue-400 hover:text-blue-300 transition-colors"
    >
      ← Kembali ke Blog
    </NuxtLink>
  </div>

  <article v-else class="max-w-4xl mx-auto py-8 px-2 sm:px-0 text-white">
    <!-- Header section with metadata -->
    <header class="mb-12">
      <div class="flex flex-wrap items-center gap-2 mb-4 justify-center">
        <span
          v-if="post.programming_language"
          class="bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
        >
          <Icon
            :name="
              languageIcons[post.programming_language.toLowerCase()] ||
              languageIcons.other
            "
            class="w-4 h-4"
          />
          {{ post.programming_language }}
        </span>
        <span
          v-if="post.article_language === 'indonesian'"
          class="bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
        >
          🇮🇩 Indonesia
        </span>
        <span
          v-else-if="post.article_language === 'english'"
          class="bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
        >
          🇬🇧 English
        </span>
        <span
          v-if="post.category"
          class="bg-blue-900 text-blue-200 px-3 py-1 rounded-full text-sm"
        >
          {{ post.category }}
        </span>
        <span
          v-if="post.ai_generated === 'ai'"
          class="bg-purple-900 text-purple-200 px-3 py-1 rounded-full text-sm flex items-center gap-1"
        >
          <Icon name="openmoji:robot" class="w-5 h-5" />
          AI Generated
        </span>
        <span
          v-else-if="post.ai_generated === 'human'"
          class="bg-green-900 text-green-200 px-3 py-1 rounded-full text-sm flex items-center gap-1"
        >
          <Icon name="mdi:account" class="w-4 h-4" />
          Human
        </span>
        <span
          v-else-if="post.ai_generated === 'hybrid'"
          class="bg-yellow-900 text-yellow-200 px-3 py-1 rounded-full text-sm flex items-center gap-1"
        >
          <Icon name="mdi:handshake" class="w-4 h-4" />
          Hybrid
        </span>
      </div>

      <h1 class="text-4xl sm:text-5xl font-bold text-center mb-6">
        {{ post.title }}
      </h1>

      <div class="flex items-center justify-center gap-3 text-gray-400">
        <time
          :datetime="post.date ? new Date(post.date).toISOString() : ''"
          class="flex items-center gap-1"
        >
          <Icon name="mdi:calendar" class="w-4 h-4" />
          {{ formatDate(post.date) }}
        </time>
        <span class="text-gray-500">•</span>
        <span class="flex items-center gap-1">
          <Icon name="mdi:clock-outline" class="w-4 h-4" />
          {{ readingTime }} min read
        </span>
      </div>
    </header>

    <!-- Content section -->
    <div class="prose prose-invert prose-lg max-w-none mb-12">
      <ContentRenderer :value="post" />
    </div>

    <!-- Comments -->
    <DisqusComments v-if="post" :identifier="post._path" :title="post.title" />

    <!-- Footer section -->
    <footer class="border-t border-gray-700 pt-8 mt-16">
      <div class="flex flex-col sm:flex-row justify-between items-center gap-6">
        <NuxtLink
          to="/blog"
          class="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
        >
          <Icon name="heroicons:arrow-left" class="w-5 h-5" />
          Kembali ke Blog
        </NuxtLink>

        <div class="flex flex-col items-center sm:items-end gap-2">
          <div class="text-sm text-gray-400">Bagikan artikel ini:</div>
          <div class="flex gap-2">
            <button
              @click="shareArticle('twitter')"
              class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              title="Share on Twitter"
            >
              <Icon name="mdi:twitter" class="w-5 h-5" />
            </button>
            <button
              @click="shareArticle('facebook')"
              class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              title="Share on Facebook"
            >
              <Icon name="mdi:facebook" class="w-5 h-5" />
            </button>
            <button
              @click="shareArticle('linkedin')"
              class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              title="Share on LinkedIn"
            >
              <Icon name="mdi:linkedin" class="w-5 h-5" />
            </button>
            <button
              @click="shareArticle('link')"
              class="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
              title="Copy Link"
            >
              <Icon name="heroicons:link" class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="relatedPosts.length > 0" class="mt-12">
        <h3 class="text-xl font-bold mb-6">Artikel Terkait</h3>
        <div class="grid sm:grid-cols-2 gap-6">
          <NuxtLink
            v-for="relatedPost in relatedPosts"
            :key="relatedPost._path"
            :to="relatedPost._path"
            class="border border-gray-700 p-4 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <h4 class="font-bold mb-2">{{ relatedPost.title }}</h4>
            <div class="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Icon name="mdi:calendar" class="w-3 h-3" />
              {{ formatDate(relatedPost.date) }}
            </div>
            <p class="text-gray-400 text-sm line-clamp-2">
              {{
                relatedPost.description ||
                (relatedPost.body && relatedPost.body.value
                  ? relatedPost.body.value[0][2].substring(0, 120) + "..."
                  : "")
              }}
            </p>
          </NuxtLink>
        </div>
      </div>
    </footer>
  </article>
</template>

<script setup>
const route = useRoute();
const { data: post, pending } = await useAsyncData(route.path, () => {
  return queryCollection("blog").path(route.path).first();
});

// SEO meta tags
const baseUrl = "https://satrio.dev";

watchEffect(() => {
  if (post.value) {
    const postUrl = `${baseUrl}${post.value._path || route.path}`;
    const postDate = post.value.date
      ? new Date(post.value.date).toISOString()
      : "";
    const description =
      post.value.description ||
      post.value.body?.value?.[0]?.[2]?.substring(0, 160) ||
      "";

    useHead({
      title: `${post.value.title} | Satrio's Blog`,
      meta: [
        { name: "description", content: description },
        {
          name: "keywords",
          content: post.value.category || post.value.programming_language || "",
        },
        { property: "og:title", content: post.value.title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: postUrl },
        { property: "og:image", content: `${baseUrl}/og-image.jpg` },
        { property: "article:published_time", content: postDate },
        { property: "article:author", content: "Satrio" },
        { property: "article:section", content: post.value.category || "Blog" },
        {
          property: "article:tag",
          content: post.value.programming_language || post.value.category || "",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "author", content: "Satrio" },
        { name: "twitter:title", content: post.value.title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${baseUrl}/og-image.jpg` },
      ],
      link: [{ rel: "canonical", href: postUrl }],
      script: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.value.title,
            description: description,
            image: `${baseUrl}/og-image.jpg`,
            datePublished: postDate,
            dateModified: postDate,
            author: {
              "@type": "Person",
              name: "Satrio",
              url: baseUrl,
            },
            publisher: {
              "@type": "Person",
              name: "Satrio",
              url: baseUrl,
            },
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": postUrl,
            },
          }),
        },
      ],
    });
  }
});

// Kalkukasi estimasi waktu baca
const readingTime = computed(() => {
  if (!post.value || !post.value.body || !post.value.body.value) return 1;
  // Ambil teks dari konten
  const text = post.value.body?.value?.[0]?.[2] || post.value.description || "";
  // Estimasi: 200 kata per menit
  const wordCount = text.trim().split(/\s+/).length;
  const time = Math.ceil(wordCount / 200);
  return time > 0 ? time : 1;
});

// Icon untuk bahasa pemrograman
const languageIcons = {
  javascript: "logos:javascript",
  python: "logos:python",
  php: "logos:php",
  typescript: "logos:typescript-icon",
  go: "logos:go",
  java: "logos:java",
  other: "mdi:code-tags",
};

// Format tanggal
const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Ambil artikel terkait
const { data: allPosts } = await useAsyncData("all-blog-posts", () => {
  return queryCollection("blog").all();
});

const relatedPosts = computed(() => {
  if (!post.value || !allPosts.value) return [];

  // Ambil artikel dengan kategori atau bahasa pemrograman yang sama, kecuali artikel saat ini
  return allPosts.value
    .filter((p) => p._path !== post.value._path && p.path !== post.value._path)
    .filter(
      (p) =>
        (post.value.category && p.category === post.value.category) ||
        (post.value.programming_language &&
          p.programming_language === post.value.programming_language),
    )
    .slice(0, 2); // Ambil maksimal 2 artikel terkait
});

// Fungsi berbagi artikel
const shareArticle = (platform) => {
  if (process.client) {
    const url = window.location.href;
    const title = post.value?.title || "Artikel Blog";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          "_blank",
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          "_blank",
        );
        break;
      case "link":
        navigator.clipboard
          .writeText(url)
          .then(() => {
            alert("Link artikel telah disalin!");
          })
          .catch((err) => {
            console.error("Gagal menyalin link:", err);
          });
        break;
    }
  }
};
</script>

<style>
.prose img {
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
  height: auto;
  display: block;
}

.prose pre {
  border-radius: 0.5rem;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 1.5em 0;
  padding: 1.25em 1.5em;
  overflow-x: auto;
  background-color: #1e293b;
  border: 1px solid #334155;
}

.prose a {
  color: #e5e7eb;
  text-decoration: underline;
  border-bottom: 1px dashed #444;
  transition: all 0.2s ease;
}

.prose a:hover {
  color: #fff;
  border-bottom-style: solid;
}

.prose h2,
.prose h3,
.prose h4 {
  margin-top: 2em;
  margin-bottom: 1em;
  font-weight: 700;
  line-height: 1.3;
}

.prose h2 {
  font-size: 1.75em;
  border-bottom: 1px solid #222;
  padding-bottom: 0.5em;
}

.prose h3 {
  font-size: 1.5em;
}

.prose h4 {
  font-size: 1.25em;
}

.prose blockquote {
  border-left: 4px solid #444;
  padding-left: 1em;
  font-style: italic;
  margin: 1.5em 0;
  color: #bcbcbc;
}

.prose ul,
.prose ol {
  padding-left: 1.5em;
  margin: 1em 0;
}

.prose li {
  margin: 0.5em 0;
}
</style>
