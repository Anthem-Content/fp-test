import { componentSchemas } from '../content/schemas/components';

/**
 * Schema Exporter for CMS Integration
 *
 * Converts Zod schemas into a CMS-friendly format that describes:
 * - Field names
 * - Field types (text, textarea, image, url, array, etc.)
 * - Field descriptions
 * - Required vs optional fields
 * - Nested object structures
 */

export type FieldType = 'text' | 'textarea' | 'image' | 'url' | 'boolean' | 'number' | 'array' | 'object';

export interface FieldDefinition {
  name: string;
  type: FieldType;
  description?: string;
  required: boolean;
  items?: FieldDefinition[]; // For arrays
  fields?: FieldDefinition[]; // For nested objects
}

export interface ComponentSchema {
  name: string;
  fields: FieldDefinition[];
}

/**
 * Extract field type from Zod schema description or infer from type
 */
function getFieldType(zodType: any): FieldType {
  // Check for description hint first (e.g., .describe('textarea'))
  const description = zodType._def?.description;
  if (description) {
    const knownTypes: FieldType[] = ['text', 'textarea', 'image', 'url', 'boolean', 'number'];
    if (knownTypes.includes(description as FieldType)) {
      return description as FieldType;
    }
  }

  // Infer from Zod type
  const typeName = zodType._def.typeName;
  switch (typeName) {
    case 'ZodString':
      return 'text';
    case 'ZodNumber':
      return 'number';
    case 'ZodBoolean':
      return 'boolean';
    case 'ZodArray':
      return 'array';
    case 'ZodObject':
      return 'object';
    default:
      return 'text';
  }
}

/**
 * Check if a Zod field is required or optional
 */
function isRequired(zodType: any): boolean {
  return zodType._def.typeName !== 'ZodOptional';
}

/**
 * Parse a Zod object schema into field definitions
 */
function parseZodObject(zodObject: any): FieldDefinition[] {
  const shape = zodObject._def.shape();
  const fields: FieldDefinition[] = [];

  for (const [fieldName, zodType] of Object.entries(shape)) {
    const field = parseZodField(fieldName, zodType as any);
    fields.push(field);
  }

  return fields;
}

/**
 * Parse a single Zod field into a field definition
 */
function parseZodField(name: string, zodType: any): FieldDefinition {
  // Unwrap optional
  let actualType = zodType;
  const required = isRequired(zodType);
  if (!required) {
    actualType = zodType._def.innerType;
  }

  const fieldType = getFieldType(actualType);
  const description = actualType.description;

  const field: FieldDefinition = {
    name,
    type: fieldType,
    description,
    required,
  };

  // Handle arrays
  if (fieldType === 'array') {
    const itemType = actualType._def.type;
    if (itemType._def.typeName === 'ZodObject') {
      field.items = parseZodObject(itemType);
    }
  }

  // Handle nested objects
  if (fieldType === 'object') {
    field.fields = parseZodObject(actualType);
  }

  return field;
}

/**
 * Export all component schemas in CMS-friendly format
 */
export function exportComponentSchemas(): ComponentSchema[] {
  const schemas: ComponentSchema[] = [];

  for (const [componentName, zodSchema] of Object.entries(componentSchemas)) {
    schemas.push({
      name: componentName,
      fields: parseZodObject(zodSchema),
    });
  }

  return schemas;
}

/**
 * Export a single component schema by name
 */
export function exportComponentSchema(componentName: string): ComponentSchema | null {
  const zodSchema = componentSchemas[componentName as keyof typeof componentSchemas];
  if (!zodSchema) {
    return null;
  }

  return {
    name: componentName,
    fields: parseZodObject(zodSchema),
  };
}

/**
 * Get a JSON representation of all schemas (for API endpoints)
 */
export function getSchemasAsJSON(): string {
  return JSON.stringify(exportComponentSchemas(), null, 2);
}
