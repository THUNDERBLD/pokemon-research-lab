import React from 'react';
import { cn } from '@/lib/utils/cn';
import { Pokemon } from '@/types/pokemon';
import { TableColumn } from '@/types/table';
import { EditableCell } from './EditableCell';

interface TableRowProps {
  pokemon: Pokemon;
  columns: TableColumn[];
  onUpdate: (pokemonId: number, field: string, value: any) => void;
  style?: React.CSSProperties;
}

export function TableRow({ pokemon, columns, onUpdate, style }: TableRowProps) {
  // Calculate total width for horizontal scrolling
  const totalWidth = columns.reduce((sum, col) => sum + (col.width || 120), 0) + 100;

  const renderCell = (column: TableColumn) => {
    const value = pokemon[column.accessorKey as keyof Pokemon];

    // Image cell
    if (column.type === 'image') {
      return (
        <div className="px-3 py-2 flex items-center justify-center">
          <img
            src={value as string}
            alt={pokemon.name}
            className="w-12 h-12 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-pokemon.png';
            }}
          />
        </div>
      );
    }

    // Array cell (types)
    if (column.type === 'array' && Array.isArray(value)) {
      return (
        <div className="px-3 py-2 flex flex-wrap gap-1">
          {value.map((item, idx) => (
            <span
              key={idx}
              className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded"
            >
              {item}
            </span>
          ))}
        </div>
      );
    }

    // Editable cell
    return (
      <EditableCell
        value={value}
        type={column.type}
        editable={column.editable}
        onSave={(newValue) => onUpdate(pokemon.id, column.accessorKey, newValue)}
      />
    );
  };

  return (
    <div className="flex border-b border-gray-200 hover:bg-gray-50" style={{ ...style, minWidth: `${totalWidth}px` }}>
      {columns.map((column, index) => (
        <div
          key={column.id}
          className={cn(
            'border-r border-gray-200',
            index === 0 && 'sticky left-0 bg-white z-10' // First column (ID) sticky
          )}
          style={{
            width: column.width || 120,
            minWidth: column.width || 120,
          }}
        >
          {renderCell(column)}
        </div>
      ))}

      {/* Placeholder for add column button alignment - Sticky on right */}
      <div
        className="sticky right-0 bg-white border-l border-gray-200 z-10"
        style={{ minWidth: 100, width: 100 }}
      />
    </div>
  );
}