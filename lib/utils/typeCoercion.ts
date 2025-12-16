// Coerce string value to number 
export function coerceToNumber(value: any): number {
  if (typeof value === 'number') return value;
  
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

// Coerce string value to boolean 
export function coerceToBoolean(value: any): boolean {
  if (typeof value === 'boolean') return value;
  
  const stringValue = String(value).toLowerCase().trim();
  const truthyValues = ['true', '1', 'yes', 'y', 'on'];
  const falsyValues = ['false', '0', 'no', 'n', 'off', ''];
  
  if (truthyValues.includes(stringValue)) return true;
  if (falsyValues.includes(stringValue)) return false;
  
  // Default to false for unknown values
  return false;
}


// Coerce value to string
export function coerceToString(value: any): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.join(', ');
  return String(value);
}

// Coerce value to array
// Splits string by common delimiters 
export function coerceToArray(value: any): string[] {
  if (Array.isArray(value)) return value;
  
  if (typeof value === 'string') {
    // Split by common delimiters: comma, semicolon, pipe, or newline
    return value
      .split(/[,;|\n]/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }
  
  // For other types, wrap in array
  return value ? [String(value)] : [];
}


// Smart type coercion based on target type
export function coerceValue(
  value: any,
  targetType: 'string' | 'number' | 'boolean' | 'array'
): any {
  switch (targetType) {
    case 'string':
      return coerceToString(value);
    case 'number':
      return coerceToNumber(value);
    case 'boolean':
      return coerceToBoolean(value);
    case 'array':
      return coerceToArray(value);
    default:
      return value;
  }
}

// Infer type from value
export function inferType(value: any): 'string' | 'number' | 'boolean' | 'array' | 'unknown' {
  if (Array.isArray(value)) return 'array';
  if (typeof value === 'boolean') return 'boolean';
  if (typeof value === 'number') return 'number';
  if (typeof value === 'string') {
    // Check if string looks like a number
    if (!isNaN(Number(value)) && value.trim() !== '') return 'number';
    // Check if string looks like a boolean
    const lower = value.toLowerCase().trim();
    if (['true', 'false', 'yes', 'no', '0', '1'].includes(lower)) return 'boolean';
    // Check if string looks like an array
    if (value.includes(',') || value.includes(';') || value.includes('|')) return 'array';
    return 'string';
  }
  return 'unknown';
}


// Validate if value matches expected type 
export function validateType(
  value: any,
  expectedType: 'string' | 'number' | 'boolean' | 'array'
): boolean {
  switch (expectedType) {
    case 'string':
      return typeof value === 'string';
    case 'number':
      return typeof value === 'number' && !isNaN(value);
    case 'boolean':
      return typeof value === 'boolean';
    case 'array':
      return Array.isArray(value);
    default:
      return false;
  }
}


// Sanitize value (remove special characters, trim whitespace) 
export function sanitizeValue(value: any): any {
  if (typeof value === 'string') {
    return value.trim().replace(/\s+/g, ' ');
  }
  return value;
}


// Parse CSV cell value intelligently
// Handles quoted strings, numbers, booleans, arrays 
export function parseCsvCellValue(value: string): any {
  const trimmed = value.trim();
  
  // Empty value
  if (trimmed === '') return null;
  
  // Quoted string - remove quotes
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) ||
      (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  
  // Boolean
  const lower = trimmed.toLowerCase();
  if (['true', 'false'].includes(lower)) {
    return lower === 'true';
  }
  
  // Number
  if (!isNaN(Number(trimmed)) && trimmed !== '') {
    return Number(trimmed);
  }
  
  // Array (comma-separated)
  if (trimmed.includes(',')) {
    return trimmed.split(',').map((item) => item.trim());
  }
  
  // Default to string
  return trimmed;
}