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
                title: z.string().min(1).max(100),
                start_date: z.date(),
                end_date: z.date().optional(),
                company: z.string().min(1),
                position: z.string().min(1),
                body: z.string().optional(),
            }),
        }),
        projects: defineCollection({
            source: 'projects/*.md',
            type: 'page',
            schema: z.object({
                title: z.string().min(1).max(100),
                date: z.date(),
                description: z.string().optional(),
                tech_stack: z.string().optional(),
                link: z.string().url().optional(),
                body: z.string().optional(),
            }),
        })
    }
})