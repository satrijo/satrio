<template>
    <section class="space-y-6">
        <div class="flex justify-between items-center">
            <h2 class="font-bold">Recent Projects</h2>
            <NuxtLink to="/projects" class="underline-link">See all projects</NuxtLink>
        </div>
        <div class="w-full space-y-4 text-gray-400">
            <div v-if="pending" class="space-y-4">
                <div
                    v-for="n in 2"
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
                        <span class="text-gray-500 group-hover:text-gray-300 text-sm transition-colors duration-300">
                            {{ project.description ? project.description.substring(0, 150) + '...' : '' }}
                        </span>
                    </div>
                    <div class="relative w-6 h-6 flex-shrink-0">
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
const { data: projects, pending } = await useAsyncData(
    'recent-projects',
    () =>
        queryCollection('projects')
            .order('date', 'DESC')
            .limit(2)
            .all(),
    {
        lazy: true
    }
)
</script> 