/**
 * Field Type Inference Utility
 *
 * Analyzes frontmatter field names and values to determine appropriate CMS input types.
 * Supports explicit type hints via field name suffixes (e.g., description__textarea).
 */

export type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'boolean' | 'number' | 'array' | 'object';

export interface FieldInfo {
  name: string;           // Clean field name (suffix removed)
  originalName: string;   // Original field name with suffix
  type: FieldType;
  value: any;
  isArray: boolean;
  children?: FieldInfo[]; // For nested objects
}

/**
 * Extract type hint from field name suffix
 * Examples: description__textarea → 'textarea', image__image → 'image'
 */
function extractTypeFromSuffix(fieldName: string): FieldType | null {
  const match = fieldName.match(/__(text|textarea|image|url)$/);
  return match ? (match[1] as FieldType) : null;
}

/**
 * Infer field type from value when no explicit suffix provided
 */
function inferTypeFromValue(value: any): FieldType {
  if (value === null || value === undefined) return 'text';

  const type = typeof value;

  if (type === 'boolean') return 'boolean';
  if (type === 'number') return 'number';
  if (Array.isArray(value)) return 'array';
  if (type === 'object') return 'object';

  // String inference
  if (type === 'string') {
    const str = value as string;

    // URL patterns
    if (str.match(/^https?:\/\//)) return 'url';
    if (str.match(/^\/[a-z-/]+$/)) return 'url';

    // Image patterns
    if (str.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) return 'image';
    if (str.match(/^\/.*\/images\//)) return 'image';
    if (str.match(/\/assets\/images\//)) return 'image';

    // Long text (textarea)
    if (str.length > 100) return 'textarea';
    if (str.includes('\n')) return 'textarea';

    // Default to text
    return 'text';
  }

  return 'text';
}

/**
 * Parse a single field and infer its type
 */
export function parseField(fieldName: string, value: any): FieldInfo {
  const explicitType = extractTypeFromSuffix(fieldName);
  const cleanName = fieldName.replace(/__(text|textarea|image|url)$/, '');
  const inferredType = explicitType || inferTypeFromValue(value);

  const info: FieldInfo = {
    name: cleanName,
    originalName: fieldName,
    type: inferredType,
    value,
    isArray: Array.isArray(value),
  };

  // Parse nested objects
  if (inferredType === 'object' && value && typeof value === 'object' && !Array.isArray(value)) {
    info.children = parseObject(value);
  }

  // Parse array items
  if (inferredType === 'array' && Array.isArray(value) && value.length > 0) {
    const firstItem = value[0];
    if (firstItem && typeof firstItem === 'object') {
      info.children = parseObject(firstItem);
    }
  }

  return info;
}

/**
 * Parse an object's fields
 */
export function parseObject(obj: Record<string, any>): FieldInfo[] {
  const fields: FieldInfo[] = [];

  for (const [fieldName, value] of Object.entries(obj)) {
    fields.push(parseField(fieldName, value));
  }

  return fields;
}

/**
 * Parse entire frontmatter data
 */
export function parsePageData(frontmatter: Record<string, any>): FieldInfo[] {
  return parseObject(frontmatter);
}

/**
 * Convert parsed fields to JSON for API responses
 */
export function fieldsToJSON(fields: FieldInfo[]): string {
  return JSON.stringify(fields, null, 2);
}
