// hooks/usePokemonData.ts
import { usePokemonStore } from '@/store/pokemonStore';
import { Pokemon } from '@/types/pokemon';

/**
 * Custom hook to interact with Pokemon data store
 * Provides easy access to Pokemon data and actions
 */
export function usePokemonData() {
  const {
    pokemons,
    customColumns,
    dataSource,
    fetchProgress,
    setPokemons,
    addPokemons,
    updatePokemon,
    deletePokemon,
    deleteMultiplePokemons,
    clearAllData,
    addCustomColumn,
    removeCustomColumn,
    bulkUpdateByCondition,
    setFetchProgress,
    resetFetchProgress,
    setDataSource,
  } = usePokemonStore();

  // Get single pokemon by id
  const getPokemonById = (id: number): Pokemon | undefined => {
    return pokemons.find((p) => p.id === id);
  };

  // Get pokemons by type
  const getPokemonsByType = (type: string): Pokemon[] => {
    return pokemons.filter((p) => 
      p.types.some((t) => t.toLowerCase() === type.toLowerCase())
    );
  };

  // Get pokemons by condition
  const getPokemonsByCondition = (
    condition: (pokemon: Pokemon) => boolean
  ): Pokemon[] => {
    return pokemons.filter(condition);
  };

  // Check if data exists
  const hasData = pokemons.length > 0;

  // Get total count
  const totalCount = pokemons.length;

  // Get fetch percentage
  const fetchPercentage = fetchProgress.total > 0
    ? Math.round((fetchProgress.current / fetchProgress.total) * 100)
    : 0;

  return {
    // Data
    pokemons,
    customColumns,
    dataSource,
    fetchProgress,
    hasData,
    totalCount,
    fetchPercentage,

    // Getters
    getPokemonById,
    getPokemonsByType,
    getPokemonsByCondition,

    // Actions
    setPokemons,
    addPokemons,
    updatePokemon,
    deletePokemon,
    deleteMultiplePokemons,
    clearAllData,
    addCustomColumn,
    removeCustomColumn,
    bulkUpdateByCondition,
    setFetchProgress,
    resetFetchProgress,
    setDataSource,
  };
}