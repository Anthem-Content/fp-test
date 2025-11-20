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
 * Defines the schema for site pages with editable content sections
 */
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    // Page metadata
    title: z.string(),
    metaDescription: z.string().max(160).optional(),
    published: z.boolean().default(true),

    // Hero Section
    hero: z.object({
      title: z.string(),
      description: z.string(),
      image: z.string(),
    }),

    // How It Works Section (IconBoxes)
    howItWorks: z.object({
      title: z.string(),
      subtitle: z.string(),
      buttonText: z.string(),
      buttonLink: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })),
    }),

    // Why Section (MediaSplit)
    whySection: z.object({
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      image: z.string(),
      imageAlt: z.string(),
      buttonText: z.string(),
      buttonUrl: z.string(),
    }),

    // Features Section (FeatureIcons)
    features: z.object({
      title: z.string(),
      subtitle: z.string(),
      description: z.string(),
      items: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
      })),
    }),

    // CTA Section (FullCta)
    cta: z.object({
      title: z.string(),
      image: z.string(),
      link: z.string(),
      buttonText: z.string(),
    }),
  })
});

export const collections = {
  examples: examples,
  pages: pages,
}; 