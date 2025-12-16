import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils/cn';

interface EditableCellProps {
  value: any;
  type: 'text' | 'number' | 'boolean' | 'array';
  editable: boolean;
  onSave: (newValue: any) => void;
  className?: string;
}

export function EditableCell({
  value,
  type,
  editable,
  onSave,
  className,
}: EditableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Update edit value when prop value changes
  useEffect(() => {
    setEditValue(value);
  }, [value]);

  const handleDoubleClick = () => {
    if (editable) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    let finalValue = editValue;

    // Type conversion
    if (type === 'number') {
      finalValue = Number(editValue);
      if (isNaN(finalValue)) finalValue = 0;
    } else if (type === 'boolean') {
      finalValue = Boolean(editValue);
    } else if (type === 'array') {
      if (typeof editValue === 'string') {
        finalValue = editValue.split(',').map((item) => item.trim());
      }
    }

    onSave(finalValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  // Format display value
  const displayValue = () => {
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return String(value);
  };

  if (!editable) {
    return (
      <div className={cn('px-3 py-2 text-sm text-gray-900', className)}>
        {displayValue()}
      </div>
    );
  }

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type={type === 'number' ? 'number' : 'text'}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        className={cn(
          'w-full px-3 py-2 text-sm border border-blue-500 rounded focus:outline-none focus:ring-2 focus:ring-blue-500',
          className
        )}
      />
    );
  }

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={cn(
        'px-3 py-2 text-sm text-gray-900 cursor-pointer hover:bg-gray-50 transition-colors',
        className
      )}
      title="Double-click to edit"
    >
      {displayValue()}
    </div>
  );
}