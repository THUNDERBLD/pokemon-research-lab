import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CustomColumn } from '@/store/types';

interface ColumnManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddColumn: (column: CustomColumn) => void;
}

export function ColumnManager({ isOpen, onClose, onAddColumn }: ColumnManagerProps) {
  const [columnName, setColumnName] = useState('');
  const [columnType, setColumnType] = useState<'text' | 'number' | 'boolean'>('text');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!columnName.trim()) {
      setError('Column name is required');
      return;
    }

    // Create column ID from name (lowercase, replace spaces with underscores)
    const columnId = columnName.toLowerCase().replace(/\s+/g, '_');

    // Get default value based on type
    const defaultValue =
      columnType === 'number' ? 0 : columnType === 'boolean' ? false : '';

    const newColumn: CustomColumn = {
      id: columnId,
      name: columnName,
      type: columnType,
      defaultValue,
    };

    onAddColumn(newColumn);
    handleClose();
  };

  const handleClose = () => {
    setColumnName('');
    setColumnType('text');
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Custom Column" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Column Name"
          value={columnName}
          onChange={(e) => {
            setColumnName(e.target.value);
            setError('');
          }}
          placeholder="e.g., Generation, Region, Notes"
          error={error}
          helperText="Enter a name for the new column"
        />

        <Select
          label="Data Type"
          value={columnType}
          onChange={(e) => setColumnType(e.target.value as 'text' | 'number' | 'boolean')}
          options={[
            { value: 'text', label: 'Text' },
            { value: 'number', label: 'Number' },
            { value: 'boolean', label: 'Boolean (Yes/No)' },
          ]}
          helperText="Choose the type of data this column will store"
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add Column
          </Button>
        </div>
      </form>
    </Modal>
  );
}