import { Pokemon } from './pokemon';

// CSV column mapping for schema mapper
export interface CsvColumnMapping {
  csvHeader: string;
  mappedField: keyof Pokemon | string | null;
  dataType: 'string' | 'number' | 'boolean' | 'array';
  isRequired: boolean;
}

// Available fields to map to
export interface MappableField {
  key: keyof Pokemon | string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'array';
  required: boolean;
}

// Predefined mappable fields for Pokemon
export const POKEMON_MAPPABLE_FIELDS: MappableField[] = [
  { key: 'id', label: 'ID', type: 'number', required: true },
  { key: 'name', label: 'Name', type: 'string', required: true },
  { key: 'sprite', label: 'Sprite URL', type: 'string', required: false },
  { key: 'types', label: 'Type(s)', type: 'array', required: false },
  { key: 'hp', label: 'HP', type: 'number', required: false },
  { key: 'attack', label: 'Attack', type: 'number', required: false },
  { key: 'defense', label: 'Defense', type: 'number', required: false },
  { key: 'specialAttack', label: 'Special Attack', type: 'number', required: false },
  { key: 'specialDefense', label: 'Special Defense', type: 'number', required: false },
  { key: 'speed', label: 'Speed', type: 'number', required: false },
  { key: 'height', label: 'Height', type: 'number', required: false },
  { key: 'weight', label: 'Weight', type: 'number', required: false },
  { key: 'abilities', label: 'Abilities', type: 'array', required: false },
];

// CSV parse result
export interface CsvParseResult {
  headers: string[];
  rowCount: number;
  sampleData: any[];
}

// CSV parsing options
export interface CsvParseOptions {
  delimiter?: string;
  skipEmptyLines?: boolean;
  dynamicTyping?: boolean;
  preview?: number;
}

// CSV export options
export interface CsvExportOptions {
  filename?: string;
  includeHeaders?: boolean;
  delimiter?: string;
  selectedColumns?: string[];
}

// Type coercion result
export interface CoercionResult {
  success: boolean;
  value: any;
  error?: string;
}

// Helper function to coerce value to target type
export function coerceValue(
  value: any,
  targetType: 'string' | 'number' | 'boolean' | 'array'
): CoercionResult {
  try {
    switch (targetType) {
      case 'string':
        return { success: true, value: String(value) };

      case 'number':
        const num = Number(value);
        if (isNaN(num)) {
          return { success: false, value: 0, error: 'Invalid number' };
        }
        return { success: true, value: num };

      case 'boolean':
        if (typeof value === 'boolean') return { success: true, value };
        const lowerValue = String(value).toLowerCase();
        if (['true', '1', 'yes'].includes(lowerValue)) {
          return { success: true, value: true };
        }
        if (['false', '0', 'no'].includes(lowerValue)) {
          return { success: true, value: false };
        }
        return { success: false, value: false, error: 'Invalid boolean' };

      case 'array':
        if (Array.isArray(value)) return { success: true, value };
        // Try splitting by common delimiters
        const stringValue = String(value);
        const arrayValue = stringValue
          .split(/[,;|]/)
          .map((item) => item.trim())
          .filter((item) => item.length > 0);
        return { success: true, value: arrayValue };

      default:
        return { success: false, value: null, error: 'Unknown type' };
    }
  } catch (error) {
    return {
      success: false,
      value: null,
      error: error instanceof Error ? error.message : 'Coercion failed',
    };
  }
}