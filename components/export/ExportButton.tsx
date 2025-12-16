'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { usePokemonData } from '@/hooks/usePokemonData';
import { exportToCSV, exportToJSON, getDefaultExportFilename } from '@/lib/utils/csvExport';

export function ExportButton() {
  const { pokemons } = usePokemonData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    setIsExporting(true);
    try {
      const filename = getDefaultExportFilename('pokemon_data');
      exportToCSV(pokemons, filename);
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to export CSV');
      console.log(error)
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportJSON = async () => {
    setIsExporting(true);
    try {
      const filename = getDefaultExportFilename('pokemon_data').replace('.csv', '.json');
      exportToJSON(pokemons, filename);
      setIsModalOpen(false);
    } catch (error) {
      alert('Failed to export JSON');
      console.log(error)
    } finally {
      setIsExporting(false);
    }
  };

  if (pokemons.length === 0) {
    return null;
  }

  return (
    <>
    <div className=''>
      <div className='z-50'>


      <Button className='cursor-pointer' variant="secondary" onClick={() => setIsModalOpen(true)}>
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        Export Data
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Export Pokemon Data"
        size="md"
      >
        <div className="space-y-4 z-[100]">
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Total Pokemon:</span> {pokemons.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Export your current Pokemon dataset with all modifications and custom columns.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-white">Choose Export Format:</h3>

            {/* CSV Export */}
            <button
              onClick={handleExportCSV}
              disabled={isExporting}
              className="w-full p-4 border cursor-pointer border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-300">CSV File</h4>
                    <p className="text-xs text-gray-500">Compatible with Excel and spreadsheet apps</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>

            {/* JSON Export */}
            <button
              onClick={handleExportJSON}
              disabled={isExporting}
              className="w-full p-4 border cursor-pointer border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h4 className="text-sm font-medium text-gray-300">JSON File</h4>
                    <p className="text-xs text-gray-500">For developers and data processing</p>
                  </div>
                </div>
                <svg
                  className="w-5 h-5 text-gray-400 group-hover:text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      </div>
    </div>
    </>
  );
}
