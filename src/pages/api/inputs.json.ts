import type { APIRoute } from 'astro';
import { readFile } from 'node:fs/promises';
import { parse } from 'yaml';
import path from 'node:path';

/**
 * API Endpoint: /api/inputs.json
 *
 * Returns the _inputs.yml configuration for CloudCannon-style field type definitions.
 * This provides the CMS with information about how to render form fields.
 *
 * Usage:
 * GET /api/inputs.json
 * Returns: Input configuration object
 */
export const GET: APIRoute = async () => {
  try {
    const inputsPath = path.join(process.cwd(), 'schemas', '_inputs.yml');
    const content = await readFile(inputsPath, 'utf-8');
    const inputs = parse(content);

    return new Response(JSON.stringify(inputs, null, 2), {
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
