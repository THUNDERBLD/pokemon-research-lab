'use client';

import { useState, useMemo } from 'react';
import { useTableVirtualization } from '@/hooks/useTableVirtualization';
import { usePokemonData } from '@/hooks/usePokemonData';
import { TableHeader } from './TableHeader';
import { TableRow } from './TableRow';
import { ColumnManager } from './ColumnManager';
import { DEFAULT_COLUMNS, TableColumn } from '@/types/table';
import { sortPokemon } from '@/lib/utils/dataTransform';

export function DataTable() {
  const { pokemons, updatePokemon, addCustomColumn, customColumns } = usePokemonData();
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);

  // Combine default columns with custom columns
  const allColumns = useMemo(() => {
    const customTableColumns: TableColumn[] = customColumns.map((col) => ({
      id: col.id,
      header: col.name,
      accessorKey: col.id,
      type: col.type,
      editable: true,
      sortable: true,
      width: 150,
      sticky: 'none' as const,
    }));

    return [...DEFAULT_COLUMNS, ...customTableColumns];
  }, [customColumns]);

  // Sort pokemons
  const sortedPokemons = useMemo(() => {
    if (!sortColumn || !sortDirection) return pokemons;
    return sortPokemon(pokemons, sortColumn, sortDirection);
  }, [pokemons, sortColumn, sortDirection]);

  // Handle sorting
  const handleSort = (columnId: string) => {
    if (sortColumn === columnId) {
      // Toggle direction or reset
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnId);
      setSortDirection('asc');
    }
  };

  // Handle cell update
  const handleCellUpdate = (pokemonId: number, field: string, value: any) => {
    updatePokemon(pokemonId, { [field]: value });
  };

  // Handle add custom column
  const handleAddColumn = (column: any) => {
    addCustomColumn(column);
  };

  // Virtualization
  const { parentRef, virtualRows, totalSize } = useTableVirtualization({
    rowCount: sortedPokemons.length,
    rowHeight: 60,
    overscan: 10,
  });

  if (pokemons.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Pokemon data</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by fetching from API or uploading a CSV file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Virtualized Table Body with Horizontal Scroll */}
      <div ref={parentRef} className="flex-1 overflow-auto">
        {/* Table Header - Fixed at top */}
        <div className="sticky top-0 z-20">
          <TableHeader
            columns={allColumns}
            sortColumn={sortColumn}
            sortDirection={sortDirection}
            onSort={handleSort}
            onAddColumn={() => setIsColumnManagerOpen(true)}
          />
        </div>

        {/* Table Rows */}
        <div style={{ height: `${totalSize}px`, position: 'relative' }}>
          {virtualRows.map((virtualRow) => {
            const pokemon = sortedPokemons[virtualRow.index];
            return (
              <TableRow
                key={pokemon.id}
                pokemon={pokemon}
                columns={allColumns}
                onUpdate={handleCellUpdate}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Stats Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
        Showing {virtualRows.length > 0 ? virtualRows[0].index + 1 : 0} to{' '}
        {virtualRows.length > 0 ? Math.min(virtualRows[virtualRows.length - 1].index + 1, sortedPokemons.length) : 0} of{' '}
        {sortedPokemons.length} Pokemon
      </div>

      {/* Column Manager Modal */}
      <ColumnManager
        isOpen={isColumnManagerOpen}
        onClose={() => setIsColumnManagerOpen(false)}
        onAddColumn={handleAddColumn}
      />
    </div>
  );
}