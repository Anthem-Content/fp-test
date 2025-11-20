import { z } from 'astro:content';

/**
 * Reusable Component Schemas
 * Define each component's data structure once and reuse across pages
 * Field type hints in .describe() help the CMS generate appropriate input fields
 */

// Field type helpers for CMS UI generation
// The type is embedded in the description string separated by a pipe: "text|description"
const textField = (label?: string) => z.string().describe(`text${label ? '|' + label : ''}`);
const textareaField = (label?: string) => z.string().describe(`textarea${label ? '|' + label : ''}`);
const imageField = (label?: string) => z.string().describe(`image${label ? '|' + label : ''}`);
const urlField = (label?: string) => z.string().describe(`url${label ? '|' + label : ''}`);

/**
 * Hero Component Schema
 * Large header section with title, description, and background image
 */
export const heroSchema = z.object({
  title: textField('Hero title - supports [brackets] for highlighting'),
  description: textareaField('Hero description text'),
  image: imageField('Hero background image'),
});

/**
 * Icon Boxes Component Schema
 * Grid of icon-based feature boxes with optional CTA button
 */
export const iconBoxesSchema = z.object({
  title: textField('Section title'),
  subtitle: textField('Section subtitle'),
  buttonText: textField('CTA button text').optional(),
  buttonLink: urlField('CTA button URL').optional(),
  items: z.array(z.object({
    title: textField('Item title'),
    description: textareaField('Item description'),
    icon: textField('Font Awesome icon class (e.g., fa-circle-1)'),
  })),
});

/**
 * Media Split Component Schema
 * Two-column layout with text content and image
 */
export const mediaSplitSchema = z.object({
  title: textField('Section title'),
  subtitle: textField('Section subtitle'),
  description: textareaField('Main content - supports markdown'),
  image: imageField('Section image'),
  imageAlt: textField('Image alt text for accessibility'),
  buttonText: textField('CTA button text').optional(),
  buttonUrl: urlField('CTA button URL').optional(),
});

/**
 * Feature Icons Component Schema
 * Grid of feature items with icons and optional hover descriptions
 */
export const featureIconsSchema = z.object({
  title: textField('Section title'),
  subtitle: textField('Section subtitle'),
  description: textareaField('Section description'),
  items: z.array(z.object({
    title: textField('Feature title'),
    description: textareaField('Feature description'),
    icon: textField('Font Awesome icon class (e.g., fa-paint-brush)'),
  })),
});

/**
 * Full CTA Component Schema
 * Full-width call-to-action section with background image
 */
export const fullCtaSchema = z.object({
  title: textField('CTA title text'),
  image: imageField('CTA background image'),
  link: urlField('CTA button destination URL'),
  buttonText: textField('CTA button text'),
});

/**
 * Simple Boxes Component Schema
 * Simple grid of content boxes
 */
export const simpleBoxesSchema = z.object({
  title: textField('Section title'),
  subtitle: textField('Section subtitle').optional(),
  items: z.array(z.object({
    title: textField('Box title'),
    description: textareaField('Box content'),
  })),
});

/**
 * Checklist Split Component Schema
 * Two-column layout with checklist items
 */
export const checklistSplitSchema = z.object({
  title: textField('Section title'),
  subtitle: textField('Section subtitle').optional(),
  items: z.array(z.object({
    title: textField('Checklist item text'),
  })),
});

/**
 * Component Registry
 * Map of all available components for CMS consumption
 */
export const componentSchemas = {
  Hero: heroSchema,
  IconBoxes: iconBoxesSchema,
  MediaSplit: mediaSplitSchema,
  FeatureIcons: featureIconsSchema,
  FullCta: fullCtaSchema,
  SimpleBoxes: simpleBoxesSchema,
  ChecklistSplit: checklistSplitSchema,
} as const;

export type ComponentType = keyof typeof componentSchemas;
