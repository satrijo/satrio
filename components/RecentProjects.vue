<template>
    <section class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="font-bold">Recent Projects</h2>
            <NuxtLink to="/projects" class="underline-link">See all projects</NuxtLink>
        </div>
        <div class="w-full space-y-4 text-gray-400">
            <div
                v-for="project in projects"
                :key="project._path"
                class="group border border-gray-400 p-2 rounded-lg shadow-md hover:bg-gray-700 hover:text-white transition-colors duration-300 cursor-pointer"
                @click="navigateTo(project._path)"
            >
                <div class="flex justify-between items-center">
                    <div>
                        <h3 class="font-bold">{{ project.title }}</h3>
                        <span class="text-gray-500 group-hover:text-gray-300 text-sm transition-colors duration-300">
                            {{ formatDate(project.date) }}
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
const { data: projects } = await useAsyncData('recent-projects', () =>
    queryContent('projects').sort({ date: -1 }).limit(2).find()
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