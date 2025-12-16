// lib/api/queries.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getPokemonById,
  getPokemonByName,
  getPokemonBatch,
  fetchAllPokemon,
  getPokemonByGeneration,
} from './pokeapi';
import { Pokemon } from '@/types/pokemon';

// Query Keys
export const queryKeys = {
  pokemon: {
    all: ['pokemon'] as const,
    byId: (id: number) => ['pokemon', 'byId', id] as const,
    byName: (name: string) => ['pokemon', 'byName', name] as const,
    batch: (ids: number[]) => ['pokemon', 'batch', ids] as const,
    generation: (gen: number) => ['pokemon', 'generation', gen] as const,
  },
};

// Hook to fetch single Pokemon by ID
export function usePokemon(id: number) {
  return useQuery({
    queryKey: queryKeys.pokemon.byId(id),
    queryFn: () => getPokemonById(id),
    enabled: id > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Hook to fetch single Pokemon by name
export function usePokemonByName(name: string) {
  return useQuery({
    queryKey: queryKeys.pokemon.byName(name),
    queryFn: () => getPokemonByName(name),
    enabled: name.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Hook to fetch batch of Pokemon
export function usePokemonBatch(ids: number[]) {
  return useQuery({
    queryKey: queryKeys.pokemon.batch(ids),
    queryFn: () => getPokemonBatch(ids),
    enabled: ids.length > 0,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Hook to fetch Pokemon by generation
export function usePokemonByGeneration(generation: number) {
  return useQuery({
    queryKey: queryKeys.pokemon.generation(generation),
    queryFn: () => getPokemonByGeneration(generation),
    enabled: generation > 0 && generation <= 9,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

// Mutation hook for fetching all Pokemon (used with button click)
export function useFetchAllPokemon() {
  return useMutation<
    Pokemon[],
    Error,
    { onProgress?: (current: number, total: number) => void }
  >({
    mutationFn: async ({ onProgress }) => {
      return fetchAllPokemon(onProgress);
    },
  });
}

// Helper hook to prefetch Pokemon data
export function usePrefetchPokemon() {
  // This can be used to prefetch data in the background
  // Useful for preloading common Pokemon or next batch
  
  return {
    prefetchById: (id: number) => {
      // Implement prefetch logic if needed
      return getPokemonById(id);
    },
    prefetchBatch: (ids: number[]) => {
      return getPokemonBatch(ids);
    },
  };
}