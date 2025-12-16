'use client';

import { useState } from 'react';
import { Providers } from './providers';
import { ApiFetcher } from '@/components/data-sources/ApiFetcher';
import { CsvUploader } from '@/components/data-sources/CsvUploader';
import { SchemaMapper } from '@/components/data-sources/SchemaMapper';
import { DataTable } from '@/components/data-table/DataTable';
import { ExportButton } from '@/components/export/ExportButton';
import { ChatOverlay } from '@/components/chat/ChatOverlay';
import { Button } from '@/components/ui/Button';
import { usePokemonData } from '@/hooks/usePokemonData';

function HomeContent() {
  const [activeTab, setActiveTab] = useState<'api' | 'csv'>('api');
  const { hasData, totalCount, clearAllData } = usePokemonData();

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-black to-gray-900">
      {/* Header */}
      <header className="relative border-b border-gray-800 bg-black shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                🔬 Pokemon Research Lab
              </h1>
              <p className="mt-1 text-sm text-gray-400">
                High-performance data analysis and management tool
              </p>
            </div>
            <div className="flex items-center gap-3">
              {hasData && (
                <>
                  <div className="text-right mr-4 px-4 py-2 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
                    <p className="text-xs text-gray-400">Total Pokemon</p>
                    <p className="text-2xl font-bold bg-linear-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      {totalCount}
                    </p>
                  </div>
                  <ExportButton />
                  <Button variant="danger" size="sm" onClick={clearAllData}>
                    Clear Data
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Data Source Section */}
        {!hasData && (
          <div className="mb-8 bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6 hover:border-blue-500/50 transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span className="text-blue-400">▸</span>
              Load Pokemon Data
            </h2>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 border-b border-gray-800">
              <button
                onClick={() => setActiveTab('api')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-all duration-300 ${
                  activeTab === 'api'
                    ? 'border-blue-500 text-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Fetch from API
              </button>
              <button
                onClick={() => setActiveTab('csv')}
                className={`px-6 py-3 font-medium text-sm border-b-2 transition-all duration-300 ${
                  activeTab === 'csv'
                    ? 'border-blue-500 text-blue-400 shadow-[0_4px_12px_rgba(59,130,246,0.3)]'
                    : 'border-transparent text-gray-400 hover:text-gray-200'
                }`}
              >
                Upload CSV
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === 'api' && <ApiFetcher />}
              {activeTab === 'csv' && <CsvUploader />}
            </div>
          </div>
        )}

        {/* Data Table Section */}
        {hasData && (
          <div className="bg-gray-900 rounded-2xl shadow-xl border border-gray-800 p-6 hover:border-blue-500/50 transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="text-blue-400">▸</span>
                Pokemon Dataset
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-800 px-4 py-2 rounded-lg border border-gray-700">
                <svg
                  className="w-4 h-4 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Double-click cells to edit • Click headers to sort</span>
              </div>
            </div>

            <div className="h-[600px] rounded-xl border border-gray-800">
              <DataTable />
            </div>
          </div>
        )}

        {/* Info Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="group bg-linear-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl shadow-xl border border-blue-500/30 p-6 hover:border-blue-400/60 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-blue-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-blue-500/40 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all duration-300">
                <svg
                  className="w-6 h-6 text-blue-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">High Performance</h3>
                <p className="text-xs text-gray-400">Virtualized table handles 1000+ rows</p>
              </div>
            </div>
          </div>

          <div className="group bg-linear-to-br from-green-500/10 to-emerald-500/10 rounded-2xl shadow-xl border border-green-500/30 p-6 hover:border-green-400/60 hover:shadow-[0_0_25px_rgba(34,197,94,0.2)] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-green-500/30 to-emerald-500/30 rounded-xl flex items-center justify-center border border-green-500/40 group-hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition-all duration-300">
                <svg
                  className="w-6 h-6 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">Inline Editing</h3>
                <p className="text-xs text-gray-400">Edit data directly in table cells</p>
              </div>
            </div>
          </div>

          <div className="group bg-linear-to-br from-purple-500/10 to-pink-500/10 rounded-2xl shadow-xl border border-purple-500/30 p-6 hover:border-purple-400/60 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-purple-500/30 to-pink-500/30 rounded-xl flex items-center justify-center border border-purple-500/40 group-hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all duration-300">
                <svg
                  className="w-6 h-6 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-white">AI Assistant</h3>
                <p className="text-xs text-gray-400">Use commands to edit data quickly</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-16 border-t border-gray-800 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Built with Next.js 14, TypeScript, TanStack Query, Zustand, and Tailwind CSS
          </p>
        </div>
      </footer>

      {/* Schema Mapper Modal */}
      <SchemaMapper />

      {/* Chat Overlay (BONUS) */}
      <ChatOverlay />
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <HomeContent />
    </Providers>
  );
}