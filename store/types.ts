import { Pokemon } from '../types/pokemon';

// Custom column definition
export interface CustomColumn {
  id: string;
  name: string;
  type: 'text' | 'number' | 'boolean';
  defaultValue: string | number | boolean;
}

// CSV mapping structure
export interface CsvColumnMapping {
  csvHeader: string;
  mappedField: keyof Pokemon | string;
  dataType: 'string' | 'number' | 'boolean';
}

// Data source type
export type DataSource = 'api' | 'csv' | null;

// UI Modal types
export type ModalType = 'addColumn' | 'schemaMapper' | null;

// Fetch progress tracking
export interface FetchProgress {
  current: number;
  total: number;
  isLoading: boolean;
}