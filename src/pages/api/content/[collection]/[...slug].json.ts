import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';
import matter from 'gray-matter';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

/**
 * API Endpoint: /api/content/[collection]/[slug].json
 *
 * GET: Fetch markdown file with parsed frontmatter and body
 * POST: Update markdown file with new frontmatter and body
 *
 * This endpoint allows the CMS to read and write markdown files directly.
 */

export const GET: APIRoute = async ({ params }) => {
  const { collection, slug } = params;

  if (!collection || !slug) {
    return new Response(JSON.stringify({ error: 'Missing collection or slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    // Get the entry from Astro's content collections
    const entry = await getEntry(collection as any, slug);

    if (!entry) {
      return new Response(JSON.stringify({ error: 'Content not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read the raw markdown file to get the body content
    const filePath = path.join(process.cwd(), 'src', 'content', collection, `${slug}.md`);
    const fileContent = await readFile(filePath, 'utf-8');
    const { data: frontmatter, content: body } = matter(fileContent);

    return new Response(JSON.stringify({
      collection,
      slug,
      frontmatter,
      body,
      filePath: `src/content/${collection}/${slug}.md`,
    }, null, 2), {
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

export const POST: APIRoute = async ({ params, request }) => {
  const { collection, slug } = params;

  if (!collection || !slug) {
    return new Response(JSON.stringify({ error: 'Missing collection or slug' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { frontmatter, body } = await request.json();

    // Serialize frontmatter and body back to markdown
    const fileContent = matter.stringify(body || '', frontmatter);

    // Write the file
    const filePath = path.join(process.cwd(), 'src', 'content', collection, `${slug}.md`);
    await writeFile(filePath, fileContent, 'utf-8');

    return new Response(JSON.stringify({
      success: true,
      message: 'Content updated successfully',
      filePath: `src/content/${collection}/${slug}.md`,
    }), {
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
