import { Pokemon } from '@/types/pokemon';
import { CsvColumnMapping } from '@/types/csv';
import { coerceValue } from './typeCoercion';

// Transform raw CSV data to Pokemon objects using column mappings 
export function transformCsvToPokemon(
  csvData: any[],
  mappings: CsvColumnMapping[]
): Pokemon[] {
  return csvData
    .map((row, index) => {
      const pokemon: any = {};
      let isValid = true;

      // Apply each mapping
      mappings.forEach((mapping) => {
        if (!mapping.mappedField || !mapping.csvHeader) return;

        const rawValue = row[mapping.csvHeader];

        // Skip if required field is missing
        if (mapping.isRequired && (rawValue === null || rawValue === undefined || rawValue === '')) {
          isValid = false;
          return;
        }

        // Coerce value to target type
        const coercedValue = coerceValue(rawValue, mapping.dataType);
        pokemon[mapping.mappedField] = coercedValue;
      });

      // Ensure required fields exist
      if (!pokemon.id || !pokemon.name) {
        isValid = false;
      }

      return isValid ? (pokemon as Pokemon) : null;
    })
    .filter((p): p is Pokemon => p !== null);
}


//  Transform Pokemon array to flat CSV-ready data
export function transformPokemonToCsv(pokemons: Pokemon[]): any[] {
  return pokemons.map((pokemon) => {
    const row: any = {};

    // Convert all fields to CSV-friendly format
    Object.keys(pokemon).forEach((key) => {
      const value = pokemon[key];

      if (Array.isArray(value)) {
        // Join arrays with comma
        row[key] = value.join(', ');
      } else if (typeof value === 'object' && value !== null) {
        // Stringify objects
        row[key] = JSON.stringify(value);
      } else {
        row[key] = value;
      }
    });

    return row;
  });
}


//  Sort Pokemon array by field
export function sortPokemon(
  pokemons: Pokemon[],
  field: keyof Pokemon | string,
  direction: 'asc' | 'desc' = 'asc'
): Pokemon[] {
  return [...pokemons].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    // Handle null/undefined
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return direction === 'asc' ? 1 : -1;
    if (bValue == null) return direction === 'asc' ? -1 : 1;

    // Handle arrays (compare by first element)
    if (Array.isArray(aValue) && Array.isArray(bValue)) {
      const aFirst = aValue[0] || '';
      const bFirst = bValue[0] || '';
      return direction === 'asc'
        ? String(aFirst).localeCompare(String(bFirst))
        : String(bFirst).localeCompare(String(aFirst));
    }

    // Handle numbers
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return direction === 'asc' ? aValue - bValue : bValue - aValue;
    }

    // Handle strings (case-insensitive)
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    return direction === 'asc'
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });
}

// Filter Pokemon by search term
export function filterPokemon(pokemons: Pokemon[], searchTerm: string): Pokemon[] {
  if (!searchTerm.trim()) return pokemons;

  const lowerSearch = searchTerm.toLowerCase();

  return pokemons.filter((pokemon) => {
    // Search in name
    if (pokemon.name.toLowerCase().includes(lowerSearch)) return true;

    // Search in types
    if (pokemon.types?.some((type) => type.toLowerCase().includes(lowerSearch))) return true;

    // Search in ID (convert to string)
    if (String(pokemon.id).includes(lowerSearch)) return true;

    // Search in abilities
    if (pokemon.abilities?.some((ability) => ability.toLowerCase().includes(lowerSearch))) {
      return true;
    }

    return false;
  });
}

// Group Pokemon by field
export function groupPokemonBy(
  pokemons: Pokemon[],
  field: keyof Pokemon | string
): Record<string, Pokemon[]> {
  return pokemons.reduce((groups, pokemon) => {
    const value = pokemon[field];
    const key = Array.isArray(value) ? value[0] : String(value);

    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(pokemon);

    return groups;
  }, {} as Record<string, Pokemon[]>);
}

// Calculate statistics for Pokemon dataset
export function calculatePokemonStats(pokemons: Pokemon[]) {
  if (pokemons.length === 0) {
    return {
      count: 0,
      avgHp: 0,
      avgAttack: 0,
      avgDefense: 0,
      avgSpeed: 0,
      typeDistribution: {},
    };
  }

  const stats = {
    count: pokemons.length,
    avgHp: 0,
    avgAttack: 0,
    avgDefense: 0,
    avgSpeed: 0,
    typeDistribution: {} as Record<string, number>,
  };

  pokemons.forEach((pokemon) => {
    stats.avgHp += pokemon.hp || 0;
    stats.avgAttack += pokemon.attack || 0;
    stats.avgDefense += pokemon.defense || 0;
    stats.avgSpeed += pokemon.speed || 0;

    // Count types
    pokemon.types?.forEach((type) => {
      stats.typeDistribution[type] = (stats.typeDistribution[type] || 0) + 1;
    });
  });

  stats.avgHp = Math.round(stats.avgHp / pokemons.length);
  stats.avgAttack = Math.round(stats.avgAttack / pokemons.length);
  stats.avgDefense = Math.round(stats.avgDefense / pokemons.length);
  stats.avgSpeed = Math.round(stats.avgSpeed / pokemons.length);

  return stats;
}

// Deduplicate Pokemon array by ID
export function deduplicatePokemon(pokemons: Pokemon[]): Pokemon[] {
  const seen = new Set<number>();
  return pokemons.filter((pokemon) => {
    if (seen.has(pokemon.id)) return false;
    seen.add(pokemon.id);
    return true;
  });
}


// Merge two Pokemon arrays (prefer newer data)
export function mergePokemonArrays(existing: Pokemon[], incoming: Pokemon[]): Pokemon[] {
  const merged = new Map<number, Pokemon>();

  // Add existing
  existing.forEach((pokemon) => {
    merged.set(pokemon.id, pokemon);
  });

  // Override with incoming
  incoming.forEach((pokemon) => {
    merged.set(pokemon.id, pokemon);
  });

  return Array.from(merged.values()).sort((a, b) => a.id - b.id);
}


// Validate Pokemon object has required fields
export function validatePokemon(pokemon: any): pokemon is Pokemon {
  return (
    typeof pokemon === 'object' &&
    pokemon !== null &&
    typeof pokemon.id === 'number' &&
    typeof pokemon.name === 'string' &&
    pokemon.name.length > 0
  );
}


// Get unique values for a field across all Pokemon
export function getUniqueValues(pokemons: Pokemon[], field: keyof Pokemon | string): any[] {
  const values = new Set();

  pokemons.forEach((pokemon) => {
    const value = pokemon[field];
    if (Array.isArray(value)) {
      value.forEach((v) => values.add(v));
    } else if (value !== null && value !== undefined) {
      values.add(value);
    }
  });

  return Array.from(values);
}