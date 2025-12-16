import Papa from 'papaparse';
import { CsvParseResult, CsvParseOptions } from '@/types/csv';
import { MAX_CSV_FILE_SIZE, ERROR_MESSAGES } from '../constants';

/**
 * Validate CSV file before parsing
 */
export function validateCsvFile(file: File): { valid: boolean; error?: string } {
  // Check if file exists
  if (!file) {
    return { valid: false, error: 'No file provided' };
  }

  // Check file type
  const validTypes = ['text/csv', 'application/vnd.ms-excel', 'text/plain'];
  const isValidType = validTypes.includes(file.type) || file.name.endsWith('.csv');
  
  if (!isValidType) {
    return { valid: false, error: ERROR_MESSAGES.INVALID_FILE_TYPE };
  }

  // Check file size
  if (file.size > MAX_CSV_FILE_SIZE) {
    return { valid: false, error: ERROR_MESSAGES.FILE_TOO_LARGE };
  }

  return { valid: true };
}

/**
 * Parse CSV headers only (for schema mapping UI)
 */
export function parseCsvHeaders(file: File): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const validation = validateCsvFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    Papa.parse(file, {
      preview: 1,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        if (headers.length === 0) {
          reject(new Error(ERROR_MESSAGES.NO_HEADERS));
          return;
        }
        resolve(headers);
      },
      error: (error) => {
        reject(new Error(error.message || ERROR_MESSAGES.PARSE_ERROR));
      },
    });
  });
}

/**
 * Parse CSV with preview (get sample data)
 */
export function parseCsvPreview(
  file: File,
  previewRows: number = 5
): Promise<CsvParseResult> {
  return new Promise((resolve, reject) => {
    const validation = validateCsvFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    Papa.parse(file, {
      preview: previewRows + 1, // +1 for headers
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        resolve({
          headers,
          rowCount: results.data.length,
          sampleData: results.data,
        });
      },
      error: (error) => {
        reject(new Error(error.message || ERROR_MESSAGES.PARSE_ERROR));
      },
    });
  });
}

/**
 * Parse entire CSV file with streaming (memory efficient)
 */
export function parseCsvFile(
  file: File,
  options?: CsvParseOptions,
  onProgress?: (progress: number) => void
): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const validation = validateCsvFile(file);
    if (!validation.valid) {
      reject(new Error(validation.error));
      return;
    }

    const results: any[] = [];
    let rowCount = 0;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: options?.skipEmptyLines ?? true,
      dynamicTyping: options?.dynamicTyping ?? false,
      delimiter: options?.delimiter,
      chunk: (chunkResults) => {
        // Process chunk
        results.push(...chunkResults.data);
        rowCount += chunkResults.data.length;

        // Report progress (approximate based on file size)
        if (onProgress) {
          const progress = Math.min((rowCount / 1000) * 10, 90); // Rough estimate
          onProgress(progress);
        }
      },
      complete: () => {
        if (onProgress) onProgress(100);
        resolve(results);
      },
      error: (error) => {
        reject(new Error(error.message || ERROR_MESSAGES.PARSE_ERROR));
      },
    });
  });
}

/**
 * Convert array of objects to CSV string
 */
export function convertToCSV(data: any[], headers?: string[]): string {
  if (data.length === 0) {
    return '';
  }

  // Use provided headers or extract from first object
  const csvHeaders = headers || Object.keys(data[0]);

  // Create CSV string
  const csv = Papa.unparse({
    fields: csvHeaders,
    data: data.map((row) => csvHeaders.map((header) => row[header] ?? '')),
  });

  return csv;
}

/**
 * Download CSV file
 */
export function downloadCSV(data: any[], filename: string = 'export.csv', headers?: string[]) {
  const csv = convertToCSV(data, headers);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Detect CSV delimiter
 */
export function detectDelimiter(fileContent: string): string {
  const delimiters = [',', ';', '\t', '|'];
  const firstLine = fileContent.split('\n')[0];
  
  let maxCount = 0;
  let detectedDelimiter = ',';

  delimiters.forEach((delimiter) => {
    const count = (firstLine.match(new RegExp(`\\${delimiter}`, 'g')) || []).length;
    if (count > maxCount) {
      maxCount = count;
      detectedDelimiter = delimiter;
    }
  });

  return detectedDelimiter;
}