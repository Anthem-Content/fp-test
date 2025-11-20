import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * API Endpoint: /api/collections.json
 *
 * Returns all available content collections and their entries.
 * Provides the CMS with a list of editable content.
 *
 * Usage:
 * GET /api/collections.json
 * Returns: Object with collection names and entry lists
 */
export const GET: APIRoute = async () => {
  try {
    // For now, we only have 'pages' collection
    // This can be expanded to support multiple collections
    const pages = await getCollection('pages');

    const collections = {
      pages: {
        name: 'pages',
        label: 'Pages',
        entries: pages.map(page => ({
          slug: page.slug,
          id: page.id,
          title: page.data.title || page.slug,
          published: page.data.published ?? true,
          filePath: `src/content/pages/${page.id}`,
        })),
      },
    };

    return new Response(JSON.stringify(collections, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
