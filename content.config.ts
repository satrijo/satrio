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
        }),
        work: defineCollection({
            source: 'work/*.md',
            type: 'page',
            schema: z.object({
                company: z.string().min(1),
                position: z.string().min(1),
                start_date: z.date(),
                end_date: z.date().optional(),
            }),
        }),
        projects: defineCollection({
            source: 'projects/*.md',
            type: 'page',
            schema: z.object({
                title: z.string().min(1).max(100),
                date: z.date(),
                link: z.string().optional(),
            }),
        })
    }
})