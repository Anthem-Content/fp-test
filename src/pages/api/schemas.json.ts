import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { parsePageData } from '../../utils/fieldTypeInference';

/**
 * API Endpoint: /api/schemas.json
 *
 * Returns field schema for a specific page by analyzing its frontmatter.
 * Field types are inferred from suffixes (__text, __textarea, __image, __url)
 * and content patterns.
 *
 * Usage:
 * GET /api/schemas.json?page=index
 * Returns: Field definitions with inferred types
 */
export const GET: APIRoute = async ({ url }) => {
  const pageSlug = url.searchParams.get('page') || 'index';

  try {
    const pages = await getCollection('pages');
    const page = pages.find(p => p.slug === pageSlug);

    if (!page) {
      return new Response(JSON.stringify({ error: 'Page not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fields = parsePageData(page.data);

    return new Response(JSON.stringify({ page: pageSlug, fields }, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow CMS to fetch from different origin
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
