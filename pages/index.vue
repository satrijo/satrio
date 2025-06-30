<template>
    <header>
        <section>
            <div class="flex justify-between items-center mb-20 py-4 sticky top-0 z-10 bg-black">
                <h1 class="text-lg font-medium">
                    <NuxtLink to="/">satrio.dev</NuxtLink>
                </h1>
                <div class="flex items-center gap-2 cursor-pointer">
                    <NuxtLink to="/" class="underline-link">blog</NuxtLink> /
                    <NuxtLink to="/work" class="underline-link">work</NuxtLink> /
                    <NuxtLink to="/projects" class="underline-link">projects</NuxtLink>
                </div>
            </div>
            <div class="mt-12 text-gray-400 space-y-4 prose-like lora">
                <p class="font-bold">Hi, I'm Nano 👋🏻</p>
                <p>I am a minimal, seo friendly, accessible portfolio and blog for developers. I am an even more
                    lightweight version of my popular theme Astro Sphere. I have a lighthouse scores of 100 across the
                    board for performance, accesibility, best practices and SEO.</p>
                <p>I come packed with full type safety, a sitemap, an rss feed, markdown and mdx support (use
                    components in your markdown) through astro integrations. I am styled with tailwind and come
                    preconfigured with light, dark and system/os theme preferences out of the box.</p>
                <p>Visit Astro Nano on Github to fork the repository, read the docs or one-click deploy on Vercel or
                    Netlify.</p>
            </div>
        </section>
    </header>
    <main>
        <section class="mt-16 space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="font-bold">Latest Posts</h2>
                <NuxtLink to="/blog" class="underline-link">See all posts</NuxtLink>
            </div>
            <div class="w-full space-y-4 text-gray-400">
                <div
                    class="group border border-gray-400 p-2 rounded-lg shadow-md hover:bg-gray-700 hover:text-white transition-colors duration-300 cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-bold">Post Title</h3>
                            <p class="text-gray-500 group-hover:text-gray-300 text-sm transition-colors duration-300">
                                Post Description</p>
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
                <div
                    class="group border border-gray-400 p-2 rounded-lg shadow-md hover:bg-gray-700 hover:text-white transition-colors duration-300 cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-bold">Post Title</h3>
                            <p class="text-gray-500 group-hover:text-gray-300 text-sm transition-colors duration-300">
                                Post Description</p>
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
                <div
                    class="group border border-gray-400 p-2 rounded-lg shadow-md hover:bg-gray-700 hover:text-white transition-colors duration-300 cursor-pointer">
                    <div class="flex justify-between items-center">
                        <div>
                            <h3 class="font-bold">Post Title</h3>
                            <p class="text-gray-500 group-hover:text-gray-300 text-sm transition-colors duration-300">
                                Post Description</p>
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
        <section class="mt-12 space-y-6">
            <div class="flex justify-between items-center">
                <h2 class="font-bold">Work Experience</h2>
                <NuxtLink to="/work" class="underline-link">See all work</NuxtLink>
            </div>
            <div class="w-full space-y-7 text-gray-400">
                <div class="py-1">
                    <div class="mb-3 text-sm">
                        <p>Nov2022 - Current</p>
                        <h3 class="font-bold text-base">Google</h3>
                        <p>Software Engineer</p>
                    </div>
                    <p>Sit amet consectetur adipisicing elit. Iure illo neque tempora, voluptatem est quaerat voluptas praesentium ipsa dolorem dignissimos nulla ratione distinctio quae maiores eligendi nostrum? Quibusdam, debitis voluptatum, lorem ipsum dolor.</p>
                </div>
                <div class="py-1">
                    <div class="mb-3 text-sm">
                        <p>Jan2020 - Nov2022</p>
                        <h3 class="font-bold text-base">Google</h3>
                        <p>Software Engineer</p>
                    </div>
                    <p>Voluptatem est quaerat voluptas praesentium ipsa dolorem dignissimos nulla ratione distinctio quae maiores eligendi nostrum? Quibusdam, debitis voluptatum, lorem ipsum dolor. Sit amet consectetur adipisicing elit. Iure illo neque tempora.</p>
                </div>
                
            </div>
        </section>
    </main>
</template>
