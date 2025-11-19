import { defineCollection, z } from 'astro:content';

const examples = defineCollection({
  type: 'data',
  schema: z.object({
    clientName: z.string(),
    url: z.string().url(),
    youtubeId: z.string(),
    category: z.enum(['Engineering', 'Architecture', 'Consulting', 'Law', 'Finance']),
    description: z.string(),
    featured_image: z.string(),
    gallery: z.object({
      title: z.string(),
      description: z.string(),
      images: z.array(z.string()).optional(),
      previews: z.object({
        desktop: z.string(),
        tablet: z.string(),
        mobile: z.string(),
      }).optional(),
    }),
    testimonial: z.object({
      quote: z.string(),
      name: z.string(),
      title: z.string(),
    }),
    cta: z.object({
      text: z.string(),
      buttonText: z.string(),
    }),
  })
});

/**
 * Pages Collection
 * Defines the schema for site pages with various field types
 * to demonstrate CMS input generation capabilities
 */
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    // Text inputs
    title: z.string(),
    subtitle: z.string().optional(),

    // Boolean toggles
    featured: z.boolean().default(false),
    published: z.boolean().default(true),

    // Date picker
    publishDate: z.date().optional(),

    // Image upload
    heroImage: z.string().optional(),

    // Tags/array of strings
    tags: z.array(z.string()).default([]),

    // Select dropdown
    layout: z.enum(['default', 'wide', 'minimal']).default('default'),

    // SEO metadata
    metaDescription: z.string().max(160).optional(),

    // Author object (nested fields)
    author: z.object({
      name: z.string(),
      email: z.string().email().optional(),
    }).optional(),
  })
});

export const collections = {
  examples: examples,
  pages: pages,
}; 