import { Pokemon } from './pokemon';

// Column configuration for the table
export interface TableColumn {
  id: string;
  header: string;
  accessorKey: keyof Pokemon | string;
  type: 'text' | 'number' | 'boolean' | 'image' | 'array';
  editable: boolean;
  sortable: boolean;
  width?: number;
  sticky?: 'left' | 'right' | 'none';
}

// Default columns for Pokemon table
export const DEFAULT_COLUMNS: TableColumn[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    type: 'number',
    editable: false,
    sortable: true,
    width: 80,
    sticky: 'left', // Only ID column is sticky left
  },
  {
    id: 'sprite',
    header: 'Sprite',
    accessorKey: 'sprite',
    type: 'image',
    editable: false,
    sortable: false,
    width: 80,
    sticky: 'none', // Not sticky
  },
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
    type: 'text',
    editable: true,
    sortable: true,
    width: 150,
    sticky: 'none', // Not sticky
  },
  {
    id: 'types',
    header: 'Type(s)',
    accessorKey: 'types',
    type: 'array',
    editable: true,
    sortable: false,
    width: 150,
    sticky: 'none', // Not sticky
  },
  {
    id: 'hp',
    header: 'HP',
    accessorKey: 'hp',
    type: 'number',
    editable: true,
    sortable: true,
    width: 80,
    sticky: 'none', // Not sticky
  },
  {
    id: 'attack',
    header: 'Attack',
    accessorKey: 'attack',
    type: 'number',
    editable: true,
    sortable: true,
    width: 80,
    sticky: 'none', // Not sticky
  },
  {
    id: 'defense',
    header: 'Defense',
    accessorKey: 'defense',
    type: 'number',
    editable: true,
    sortable: true,
    width: 80,
    sticky: 'none', // Not sticky
  },
  {
    id: 'specialAttack',
    header: 'Sp. Atk',
    accessorKey: 'specialAttack',
    type: 'number',
    editable: true,
    sortable: true,
    width: 80,
    sticky: 'none', // Not sticky
  },
  {
    id: 'specialDefense',
    header: 'Sp. Def',
    accessorKey: 'specialDefense',
    type: 'number',
    editable: true,
    sortable: true,
    width: 80,
    sticky: 'none', // Not sticky
  },
  {
    id: 'speed',
    header: 'Speed',
    accessorKey: 'speed',
    type: 'number',
    editable: true,
    sortable: true,
    width: 80,
    sticky: 'none', // Not sticky
  },
];

// Sort direction
export type SortDirection = 'asc' | 'desc' | null;

// Sort state
export interface SortState {
  columnId: string | null;
  direction: SortDirection;
}

// Cell edit state
export interface CellEditState {
  rowId: number;
  columnId: string;
  value: any;
}

// Table virtualization config
export interface VirtualizationConfig {
  rowHeight: number;
  overscan: number;
  enabled: boolean;
}

// Default virtualization settings
export const DEFAULT_VIRTUALIZATION_CONFIG: VirtualizationConfig = {
  rowHeight: 60,
  overscan: 10,
  enabled: true,
};