import Papa from 'papaparse';
import { Pokemon } from '@/types/pokemon';
import { transformPokemonToCsv } from './dataTransform';


// Export Pokemon data to CSV file 
export function exportToCSV(
  pokemons: Pokemon[],
  filename: string = 'pokemon_export.csv',
  selectedColumns?: string[]
): void {
  if (pokemons.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Transform Pokemon to CSV-friendly format
  let dataToExport = transformPokemonToCsv(pokemons);

  // Filter columns if specified
  if (selectedColumns && selectedColumns.length > 0) {
    dataToExport = dataToExport.map((row) => {
      const filteredRow: any = {};
      selectedColumns.forEach((col) => {
        filteredRow[col] = row[col];
      });
      return filteredRow;
    });
  }

  // Convert to CSV string
  const csv = Papa.unparse(dataToExport, {
    header: true,
    skipEmptyLines: true,
  });

  // Download file
  downloadFile(csv, filename, 'text/csv');
}


// Export Pokemon data to JSON file 
export function exportToJSON(
  pokemons: Pokemon[],
  filename: string = 'pokemon_export.json'
): void {
  if (pokemons.length === 0) {
    console.warn('No data to export');
    return;
  }

  const json = JSON.stringify(pokemons, null, 2);
  downloadFile(json, filename, 'application/json');
}


// Download file to user's computer
function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
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


// Get default export filename with timestamp
export function getDefaultExportFilename(prefix: string = 'pokemon_export'): string {
  const date = new Date();
  const timestamp = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${prefix}_${timestamp}.csv`;
}


// Export specific columns only
export function exportSelectedColumns(
  pokemons: Pokemon[],
  columns: string[],
  filename?: string
): void {
  const actualFilename = filename || getDefaultExportFilename();
  exportToCSV(pokemons, actualFilename, columns);
}


// Export filtered Pokemon data
export function exportFiltered(
  pokemons: Pokemon[],
  filterFn: (pokemon: Pokemon) => boolean,
  filename?: string
): void {
  const filtered = pokemons.filter(filterFn);
  const actualFilename = filename || getDefaultExportFilename('pokemon_filtered');
  exportToCSV(filtered, actualFilename);
}


// Format file size for display
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}


// Estimate CSV file size before export
export function estimateCsvSize(pokemons: Pokemon[]): number {
  if (pokemons.length === 0) return 0;

  // Rough estimate: average row size * number of rows
  const sampleRow = transformPokemonToCsv([pokemons[0]])[0];
  const sampleString = JSON.stringify(sampleRow);
  const avgRowSize = sampleString.length;

  return avgRowSize * pokemons.length;
}


// Check if export would be large (> 10MB)
export function isLargeExport(pokemons: Pokemon[]): boolean {
  const estimatedSize = estimateCsvSize(pokemons);
  return estimatedSize > 10 * 1024 * 1024; // 10MB
}


// Split large export into chunks
export function exportInChunks(
  pokemons: Pokemon[],
  chunkSize: number = 200,
  prefix: string = 'pokemon_export'
): void {
  const totalChunks = Math.ceil(pokemons.length / chunkSize);

  for (let i = 0; i < totalChunks; i++) {
    const start = i * chunkSize;
    const end = Math.min(start + chunkSize, pokemons.length);
    const chunk = pokemons.slice(start, end);
    const filename = `${prefix}_part${i + 1}_of_${totalChunks}.csv`;
    
    exportToCSV(chunk, filename);
  }
}