import { cn } from '@/lib/utils/cn';
import { TableColumn } from '@/types/table';

interface TableHeaderProps {
  columns: TableColumn[];
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (columnId: string) => void;
  onAddColumn: () => void;
}

export function TableHeader({
  columns,
  sortColumn,
  sortDirection,
  onSort,
  onAddColumn,
}: TableHeaderProps) {
  // Calculate total width for horizontal scrolling
  const totalWidth = columns.reduce((sum, col) => sum + (col.width || 120), 0) + 100; // +100 for add column button

  const renderSortIcon = (columnId: string) => {
    if (sortColumn !== columnId) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="flex bg-gray-50 border-b border-gray-200" style={{ minWidth: `${totalWidth}px` }}>
      {columns.map((column, index) => (
        <div
          key={column.id}
          className={cn(
            'flex items-center justify-between px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider border-r border-gray-200',
            column.sortable && 'cursor-pointer hover:bg-gray-100 transition-colors',
            index === 0 && 'sticky left-0 bg-gray-50 z-20' // First column (ID) sticky
          )}
          style={{ 
            width: column.width || 120,
            minWidth: column.width || 120,
          }}
          onClick={() => column.sortable && onSort(column.id)}
        >
          <span className="truncate">{column.header}</span>
          {column.sortable && renderSortIcon(column.id)}
        </div>
      ))}

      {/* Add Column Button - Sticky on right */}
      <div
        className="sticky right-0 flex items-center justify-center px-3 py-3 bg-gray-50 border-l border-gray-200 z-20 cursor-pointer hover:bg-gray-100 transition-colors"
        style={{ minWidth: 100, width: 100 }}
        onClick={onAddColumn}
      >
        <button className="flex items-center gap-1 text-xs font-medium text-blue-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Column
        </button>
      </div>
    </div>
  );
}