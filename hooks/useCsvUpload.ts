import { useState } from 'react';
import Papa from 'papaparse';
import { useUiStore } from '@/store/uiStore';
import { usePokemonData } from './usePokemonData';
import { CsvColumnMapping, coerceValue } from '@/types/csv';
import { Pokemon } from '@/types/pokemon';

/**
 * Custom hook for handling CSV upload and parsing
 * Uses streaming to avoid memory issues with large files
 */
export function useCsvUpload() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const { setCsvFile, setCsvHeaders, setIsParsing, clearCsvData } = useUiStore();
  const { setPokemons, setDataSource } = usePokemonData();

  // Parse CSV headers only (for schema mapping UI)
  const parseHeaders = async (file: File): Promise<string[] | null> => {
    return new Promise((resolve, reject) => {
      setIsParsing(true);
      setError(null);

      Papa.parse(file, {
        preview: 1, // Only parse first row for headers
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const headers = results.meta.fields || [];
          setCsvHeaders(headers);
          setCsvFile(file);
          setIsParsing(false);
          resolve(headers);
        },
        error: (err) => {
          setError(err.message);
          setIsParsing(false);
          reject(err);
        },
      });
    });
  };

  // Parse full CSV with column mappings
  const parseWithMappings = async (
    file: File,
    mappings: CsvColumnMapping[]
  ): Promise<Pokemon[]> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      const pokemons: Pokemon[] = [];
      let rowCount = 0;

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: false, // We'll handle type coercion manually
        chunk: (results, parser) => {
          // Process chunk of rows
          results.data.forEach((row: any) => {
            const pokemon: any = {};
            let isValid = true;

            // Map CSV columns to Pokemon fields
            mappings.forEach((mapping) => {
              if (mapping.mappedField && mapping.csvHeader) {
                const rawValue = row[mapping.csvHeader];

                // Coerce value to correct type
                const coerced = coerceValue(rawValue, mapping.dataType);

                if (coerced.success) {
                  pokemon[mapping.mappedField] = coerced.value;
                } else if (mapping.isRequired) {
                  isValid = false;
                }
              }
            });

            if (isValid) {
              pokemons.push(pokemon as Pokemon);
            }

            rowCount++;
          });

          // Update progress
          setUploadProgress(Math.min(rowCount / 1000, 100)); // Approximate progress
        },
        complete: () => {
          setPokemons(pokemons);
          setDataSource('csv');
          setIsUploading(false);
          setUploadProgress(100);
          clearCsvData();
          resolve(pokemons);
        },
        error: (err) => {
          setError(err.message);
          setIsUploading(false);
          reject(err);
        },
      });
    });
  };

  // Simple CSV parse without mapping (auto-detect)
  const parseSimple = async (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
      setIsUploading(true);
      setError(null);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          setIsUploading(false);
          resolve(results.data);
        },
        error: (err) => {
          setError(err.message);
          setIsUploading(false);
          reject(err);
        },
      });
    });
  };

  // Reset upload state
  const reset = () => {
    setIsUploading(false);
    setUploadProgress(0);
    setError(null);
    clearCsvData();
  };

  return {
    isUploading,
    uploadProgress,
    error,
    parseHeaders,
    parseWithMappings,
    parseSimple,
    reset,
  };
}