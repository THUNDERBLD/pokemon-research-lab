import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';
import { DEFAULT_VIRTUALIZATION_CONFIG } from '@/types/table';

interface UseTableVirtualizationProps {
  rowCount: number;
  rowHeight?: number;
  overscan?: number;
  enabled?: boolean;
}

/**
 * Custom hook for table virtualization using TanStack Virtual
 * Only renders visible rows for performance with large datasets
 */
export function useTableVirtualization({
  rowCount,
  rowHeight = DEFAULT_VIRTUALIZATION_CONFIG.rowHeight,
  overscan = DEFAULT_VIRTUALIZATION_CONFIG.overscan,
  enabled = DEFAULT_VIRTUALIZATION_CONFIG.enabled,
}: UseTableVirtualizationProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Setup virtualizer
  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight,
    overscan: overscan,
    enabled: enabled,
  });

  // Get virtual items (visible rows)
  const virtualRows = rowVirtualizer.getVirtualItems();

  // Get total size of all rows
  const totalSize = rowVirtualizer.getTotalSize();

  // Get range of visible rows
  const virtualRange = virtualRows.length > 0
    ? {
        start: virtualRows[0].index,
        end: virtualRows[virtualRows.length - 1].index,
      }
    : { start: 0, end: 0 };

  // Scroll to specific index
  const scrollToIndex = (index: number, options?: { align?: 'start' | 'center' | 'end' | 'auto' }) => {
    rowVirtualizer.scrollToIndex(index, options);
  };

  // Scroll to top
  const scrollToTop = () => {
    scrollToIndex(0, { align: 'start' });
  };

  // Scroll to bottom
  const scrollToBottom = () => {
    scrollToIndex(rowCount - 1, { align: 'end' });
  };

  return {
    parentRef,
    virtualRows,
    totalSize,
    virtualRange,
    scrollToIndex,
    scrollToTop,
    scrollToBottom,
    rowVirtualizer,
  };
}