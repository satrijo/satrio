<template>
    <section class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="font-bold">Latest Posts</h2>
            <NuxtLink to="/blog" class="underline-link">See all posts</NuxtLink>
        </div>
        <div class="w-full space-y-4 text-gray-400">
            <div
                v-for="post in posts"
                :key="post._path"
                class="group border border-gray-400 p-2 rounded-lg shadow-md hover:bg-gray-700 hover:text-white transition-colors duration-300 cursor-pointer"
                @click="navigateTo(post._path)"
            >
                <div class="flex justify-between items-center">
                    <div>
                        <div class="flex items-center gap-2 mb-1">
                            <span v-if="post.programming_language">
                                <Icon :name="languageIcons[post.programming_language] || languageIcons.other" class="w-5 h-5" />
                            </span>
                            <span v-if="post.article_language === 'indonesian'">🇮🇩</span>
                            <span v-else-if="post.article_language === 'english'">🇬🇧</span>
                            <span v-if="post.category" class="ml-2 text-xs text-blue-400">{{ post.category }}</span>
                        </div>
                        <h3 class="font-bold">{{ post.title }}</h3>
                        <span class="text-gray-500 group-hover:text-gray-300 text-sm transition-colors duration-300">
                            {{ formatDate(post.date) }}
                        </span>
                    </div>
                    <div class="relative w-6 h-6">
                        <div
                            class="absolute inset-0 transition-opacity duration-300 opacity-100 group-hover:opacity-0">
                            <Icon name="ep:arrow-right" class="w-6 h-6" />
                        </div>
                        <div
                            class="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                            <Icon name="line-md:arrow-right-circle" class="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const languageIcons = {
    javascript: 'logos:javascript',
    python: 'logos:python',
    php: 'logos:php',
    typescript: 'logos:typescript-icon',
    go: 'logos:go',
    java: 'logos:java',
    other: 'mdi:code-tags'
}

const { data: posts } = await useAsyncData('latest-posts', () =>
    queryContent('blog').sort({ date: -1 }).limit(3).find()
)

const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script> 