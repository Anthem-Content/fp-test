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

export const collections = {
  // ... other collections ...
  examples: examples,
}; 