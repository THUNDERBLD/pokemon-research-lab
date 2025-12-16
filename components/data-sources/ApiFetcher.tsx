'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { usePokemonData } from '@/hooks/usePokemonData';
import { fetchAllPokemon } from '@/lib/api/pokeapi';
import { MESSAGES } from '@/lib/constants';

export function ApiFetcher() {
  const { setPokemons, setFetchProgress, resetFetchProgress, fetchProgress, hasData } = usePokemonData();
  const [error, setError] = useState<string | null>(null);

  const handleFetchAll = async () => {
    try {
      setError(null);
      setFetchProgress({ isLoading: true, current: 0, total: 1025 });

      const pokemons = await fetchAllPokemon((current, total) => {
        setFetchProgress({ current, total, isLoading: true });
      });

      setPokemons(pokemons);
      setFetchProgress({ isLoading: false });
      resetFetchProgress();
    } catch (err) {
      setError(err instanceof Error ? err.message : MESSAGES.FETCH_ERROR);
      resetFetchProgress();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">Fetch from PokeAPI</h3>
          <p className="text-sm text-gray-400">
            Download complete Pokemon dataset from the public API
          </p>
        </div>
        <Button
          onClick={handleFetchAll}
          isLoading={fetchProgress.isLoading}
          disabled={fetchProgress.isLoading}
          variant="primary"
        >
          {hasData ? 'Refetch Data' : 'Fetch Full Pokedex'}
        </Button>
      </div>

      {fetchProgress.isLoading && (
        <ProgressBar
          current={fetchProgress.current}
          total={fetchProgress.total}
          label="Fetching Pokemon data..."
          showPercentage
          showCount
        />
      )}

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-red-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error fetching data</h3>
              <p className="mt-1 text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {hasData && !fetchProgress.isLoading && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-start">
            <svg
              className="w-5 h-5 text-green-600 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Data loaded successfully</h3>
              <p className="mt-1 text-sm text-green-700">
                Pokemon dataset is ready for analysis
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}