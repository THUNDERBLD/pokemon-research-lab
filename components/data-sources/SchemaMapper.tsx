'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useUiStore } from '@/store/uiStore';
import { useCsvUpload } from '@/hooks/useCsvUpload';
import { POKEMON_MAPPABLE_FIELDS, CsvColumnMapping } from '@/types/csv';

export function SchemaMapper() {
  const { activeModal, modalData, closeModal } = useUiStore();
  const { parseWithMappings, isUploading } = useCsvUpload();
  const [mappings, setMappings] = useState<CsvColumnMapping[]>([]);
  const [error, setError] = useState<string | null>(null);

  const isOpen = activeModal === 'schemaMapper';
  const file = modalData?.file;
  const headers = modalData?.headers || [];

  // Initialize mappings when modal opens
  useEffect(() => {
    if (isOpen && headers.length > 0) {
      const initialMappings: CsvColumnMapping[] = headers.map((header: string) => ({
        csvHeader: header,
        mappedField: null,
        dataType: 'string',
        isRequired: false,
      }));
      setMappings(initialMappings);
      setError(null);
    }
  }, [isOpen, headers]);

  const handleMappingChange = (index: number, field: string) => {
    const newMappings = [...mappings];
    
    if (field === '') {
      newMappings[index].mappedField = null;
      newMappings[index].dataType = 'string';
      newMappings[index].isRequired = false;
    } else {
      const mappableField = POKEMON_MAPPABLE_FIELDS.find((f) => f.key === field);
      if (mappableField) {
        newMappings[index].mappedField = mappableField.key;
        newMappings[index].dataType = mappableField.type;
        newMappings[index].isRequired = mappableField.required;
      }
    }
    
    setMappings(newMappings);
  };

  const validateMappings = (): boolean => {
    // Check if required fields are mapped
    const hasId = mappings.some((m) => m.mappedField === 'id');
    const hasName = mappings.some((m) => m.mappedField === 'name');

    if (!hasId || !hasName) {
      setError('Required fields (ID and Name) must be mapped');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateMappings()) return;
    if (!file) return;

    try {
      setError(null);
      await parseWithMappings(file, mappings);
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to parse CSV');
    }
  };

  const getAvailableFields = (currentIndex: number) => {
    const usedFields = mappings
      .filter((_, idx) => idx !== currentIndex)
      .map((m) => m.mappedField)
      .filter((field): field is string => field !== null);

    return POKEMON_MAPPABLE_FIELDS.filter((field) => !usedFields.includes(field.key));
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Map CSV Columns" size="xl">
      <div className="space-y-4">
        <div className="p-4 bg-black border rounded-md">
          <p className="text-sm text-white">
            Map your CSV columns to Pokemon fields. Required fields are marked with an asterisk (*).
          </p>
        </div>

        {/* Mapping Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-black text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium  uppercase">
                  CSV Column
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Maps to
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase">
                  Data Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-black divide-y divide-gray-200">
              {mappings.map((mapping, index) => {
                const availableFields = getAvailableFields(index);
                const options = [
                  { value: '', label: '-- Do not map --' },
                  ...availableFields.map((field) => ({
                    value: field.key,
                    label: `${field.label}${field.required ? ' *' : ''}`,
                  })),
                ];

                return (
                  <tr key={index}>
                    <td className="px-4 py-3 text-sm font-medium text-white">
                      {mapping.csvHeader}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        options={options}
                        value={mapping.mappedField || ''}
                        onChange={(e) => handleMappingChange(index, e.target.value)}
                        placeholder="Select field..."
                      />
                    </td>
                    <td className="px-4 py-3 text-sm text-white">
                      {mapping.mappedField ? mapping.dataType : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="secondary" onClick={closeModal} disabled={isUploading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} isLoading={isUploading}>
            Import Data
          </Button>
        </div>
      </div>
    </Modal>
  );
}