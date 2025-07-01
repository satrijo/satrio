import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            source: 'blog/*.md',
            type: 'page',
            schema: z.object({
                title: z.string().min(1).max(100),
                date: z.date(),
                description: z.string().optional(),
                category: z.string().optional(),
                article_language: z.string().optional(),
                programming_language: z.string().optional(),
            }),
        })
    }
})