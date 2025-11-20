import { defineCollection, z } from 'astro:content';

/**
 * Pages Collection
 *
 * Flexible schema that allows any frontmatter structure.
 * Field types are inferred from suffix hints in the markdown:
 *
 * - fieldName__text: Text input (short string)
 * - fieldName__textarea: Textarea (long text)
 * - fieldName__image: Image file picker
 * - fieldName__url: URL input
 * - fieldName (no suffix): Auto-detected based on content
 *
 * The CMS reads the markdown and generates appropriate form fields.
 */
const pages = defineCollection({
  type: 'content',
  schema: z.object({
    // Basic page metadata
    title: z.string(),
    metaDescription: z.string().optional(),
    published: z.boolean().default(true),
  }).passthrough(), // Allow any additional fields without strict validation
});

export const collections = {
  pages: pages,
}; 