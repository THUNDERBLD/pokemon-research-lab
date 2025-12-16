import { create } from 'zustand';
import { CustomColumn, DataSource, FetchProgress } from './types';
import { Pokemon } from '@/types/pokemon';

interface PokemonStore {
  // Data
  pokemons: Pokemon[];
  customColumns: CustomColumn[];
  dataSource: DataSource;
  fetchProgress: FetchProgress;

  // Actions - Data Management
  setPokemons: (pokemons: Pokemon[]) => void;
  addPokemons: (pokemons: Pokemon[]) => void;
  updatePokemon: (id: number, updates: Partial<Pokemon>) => void;
  deletePokemon: (id: number) => void;
  deleteMultiplePokemons: (ids: number[]) => void;
  clearAllData: () => void;

  // Actions - Column Management
  addCustomColumn: (column: CustomColumn) => void;
  removeCustomColumn: (columnId: string) => void;

  // Actions - Bulk Updates (for chat commands)
  bulkUpdateByCondition: (
    condition: (pokemon: Pokemon) => boolean,
    updates: Partial<Pokemon>
  ) => void;

  // Actions - Fetch Progress
  setFetchProgress: (progress: Partial<FetchProgress>) => void;
  resetFetchProgress: () => void;

  // Actions - Data Source
  setDataSource: (source: DataSource) => void;
}

export const usePokemonStore = create<PokemonStore>((set) => ({
  // Initial State
  pokemons: [],
  customColumns: [],
  dataSource: null,
  fetchProgress: {
    current: 0,
    total: 0,
    isLoading: false,
  },

  // Set complete pokemon array (used when fetching from API or CSV)
  setPokemons: (pokemons) => 
    set({ pokemons, dataSource: pokemons.length > 0 ? 'api' : null }),

  // Add pokemons incrementally (useful for streaming)
  addPokemons: (newPokemons) =>
    set((state) => ({
      pokemons: [...state.pokemons, ...newPokemons],
    })),

  // Update single pokemon by id
  updatePokemon: (id, updates) =>
    set((state) => ({
      pokemons: state.pokemons.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),

  // Delete single pokemon
  deletePokemon: (id) =>
    set((state) => ({
      pokemons: state.pokemons.filter((p) => p.id !== id),
    })),

  // Delete multiple pokemons
  deleteMultiplePokemons: (ids) =>
    set((state) => ({
      pokemons: state.pokemons.filter((p) => !ids.includes(p.id)),
    })),

  // Clear all data
  clearAllData: () =>
    set({
      pokemons: [],
      customColumns: [],
      dataSource: null,
      fetchProgress: { current: 0, total: 0, isLoading: false },
    }),

  // Add a new custom column
  addCustomColumn: (column) =>
    set((state) => {
      const updatedPokemons = state.pokemons.map((pokemon) => ({
        ...pokemon,
        [column.id]: column.defaultValue,
      }));

      return {
        customColumns: [...state.customColumns, column],
        pokemons: updatedPokemons,
      };
    }),

  // Remove custom column
  removeCustomColumn: (columnId) =>
    set((state) => {
      const updatedPokemons = state.pokemons.map((pokemon) => {
        const { [columnId]: removed, ...rest } = pokemon;
        return rest as Pokemon;
      });

      return {
        customColumns: state.customColumns.filter((col) => col.id !== columnId),
        pokemons: updatedPokemons,
      };
    }),

  // Bulk update based on condition (for chat commands)
  bulkUpdateByCondition: (condition, updates) =>
    set((state) => ({
      pokemons: state.pokemons.map((pokemon) =>
        condition(pokemon) ? { ...pokemon, ...updates } : pokemon
      ),
    })),

  // Update fetch progress
  setFetchProgress: (progress) =>
    set((state) => ({
      fetchProgress: { ...state.fetchProgress, ...progress },
    })),

  // Reset fetch progress
  resetFetchProgress: () =>
    set({
      fetchProgress: { current: 0, total: 0, isLoading: false },
    }),

  // Set data source
  setDataSource: (source) => set({ dataSource: source }),
}));