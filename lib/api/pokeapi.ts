import axios from 'axios';
import { PokeApiPokemon, transformApiPokemon, Pokemon } from '@/types/pokemon';
import { POKEAPI_POKEMON_ENDPOINT, TOTAL_POKEMON_COUNT } from '../constants';

// Get list of all Pokemon (returns URLs only)
export async function getPokemonList(limit: number = TOTAL_POKEMON_COUNT, offset: number = 0) {
  try {
    const response = await axios.get(POKEAPI_POKEMON_ENDPOINT, {
      params: { limit, offset },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching pokemon list:', error);
    throw new Error('Failed to fetch pokemon list');
  }
}

// Get single Pokemon by ID
export async function getPokemonById(id: number): Promise<Pokemon> {
  try {
    const response = await axios.get<PokeApiPokemon>(`${POKEAPI_POKEMON_ENDPOINT}/${id}`);
    return transformApiPokemon(response.data);
  } catch (error) {
    console.error(`Error fetching pokemon ${id}:`, error);
    throw new Error(`Failed to fetch pokemon ${id}`);
  }
}

// Get single Pokemon by name
export async function getPokemonByName(name: string): Promise<Pokemon> {
  try {
    const response = await axios.get<PokeApiPokemon>(`${POKEAPI_POKEMON_ENDPOINT}/${name.toLowerCase()}`);
    return transformApiPokemon(response.data);
  } catch (error) {
    console.error(`Error fetching pokemon ${name}:`, error);
    throw new Error(`Failed to fetch pokemon ${name}`);
  }
}

// Get multiple Pokemon by IDs (batch fetching)
export async function getPokemonBatch(ids: number[]): Promise<Pokemon[]> {
  try {
    const promises = ids.map((id) => getPokemonById(id));
    const results = await Promise.allSettled(promises);
    
    // Filter out failed requests and return successful ones
    return results
      .filter((result): result is PromiseFulfilledResult<Pokemon> => result.status === 'fulfilled')
      .map((result) => result.value);
  } catch (error) {
    console.error('Error fetching pokemon batch:', error);
    throw new Error('Failed to fetch pokemon batch');
  }
}

// Get Pokemon in chunks with progress callback
export async function fetchAllPokemon(
  onProgress?: (current: number, total: number) => void
): Promise<Pokemon[]> {
  const allPokemons: Pokemon[] = [];
  const totalCount = TOTAL_POKEMON_COUNT;

  try {
    // Fetch in batches to avoid overwhelming the API
    const batchSize = 20;
    const batches = Math.ceil(totalCount / batchSize);

    for (let batch = 0; batch < batches; batch++) {
      const startId = batch * batchSize + 1;
      const endId = Math.min((batch + 1) * batchSize, totalCount);
      const ids = Array.from({ length: endId - startId + 1 }, (_, i) => startId + i);

      const batchPokemons = await getPokemonBatch(ids);
      allPokemons.push(...batchPokemons);

      // Report progress
      if (onProgress) {
        onProgress(allPokemons.length, totalCount);
      }

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    return allPokemons;
  } catch (error) {
    console.error('Error fetching all pokemon:', error);
    throw new Error('Failed to fetch all pokemon');
  }
}

// Fetch Pokemon by generation
export async function getPokemonByGeneration(generation: number): Promise<Pokemon[]> {
  const generationRanges: Record<number, { start: number; end: number }> = {
    1: { start: 1, end: 151 },
    2: { start: 152, end: 251 },
    3: { start: 252, end: 386 },
    4: { start: 387, end: 493 },
    5: { start: 494, end: 649 },
    6: { start: 650, end: 721 },
    7: { start: 722, end: 809 },
    8: { start: 810, end: 905 },
    9: { start: 906, end: 1025 },
  };

  const range = generationRanges[generation];
  if (!range) {
    throw new Error(`Invalid generation: ${generation}`);
  }

  const ids = Array.from(
    { length: range.end - range.start + 1 },
    (_, i) => range.start + i
  );

  return getPokemonBatch(ids);
}