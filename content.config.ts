import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
    collections: {
        blog: defineCollection({
            source: 'blog/*.md',
            type: 'page',
            schema: z.object({
                title: z.string().min(1).max(100),
                date: z.union([z.date(), z.string()]),
                description: z.string().optional(),
                category: z.string().optional(),
                ai_generated: z.string().optional(),
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
                start_date: z.union([z.date(), z.string()]),
                end_date: z.union([z.date(), z.string()]).optional(),
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