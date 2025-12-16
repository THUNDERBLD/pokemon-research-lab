import { create } from 'zustand';
import { ModalType } from './types';

interface UiStore {
  // Modal State
  activeModal: ModalType;
  modalData: any;

  // Chat Overlay State
  isChatOpen: boolean;
  chatMessages: ChatMessage[];

  // Loading States
  isTableLoading: boolean;

  // CSV Upload State
  csvFile: File | null;
  csvHeaders: string[];
  isParsing: boolean;

  // Actions - Modal
  openModal: (modalType: ModalType, data?: any) => void;
  closeModal: () => void;

  // Actions - Chat
  toggleChat: () => void;
  addChatMessage: (message: ChatMessage) => void;
  clearChatMessages: () => void;

  // Actions - Loading
  setTableLoading: (isLoading: boolean) => void;

  // Actions - CSV Upload
  setCsvFile: (file: File | null) => void;
  setCsvHeaders: (headers: string[]) => void;
  setIsParsing: (isParsing: boolean) => void;
  clearCsvData: () => void;
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'system';
  content: string;
  timestamp: Date;
}

export const useUiStore = create<UiStore>((set) => ({
  // Initial State
  activeModal: null,
  modalData: null,
  isChatOpen: false,
  chatMessages: [],
  isTableLoading: false,
  csvFile: null,
  csvHeaders: [],
  isParsing: false,

  // Open modal with optional data
  openModal: (modalType, data = null) =>
    set({ activeModal: modalType, modalData: data }),

  // Close modal and clear data
  closeModal: () =>
    set({ activeModal: null, modalData: null }),

  // Toggle chat overlay
  toggleChat: () =>
    set((state) => ({ isChatOpen: !state.isChatOpen })),

  // Add chat message
  addChatMessage: (message) =>
    set((state) => ({
      chatMessages: [...state.chatMessages, message],
    })),

  // Clear all chat messages
  clearChatMessages: () =>
    set({ chatMessages: [] }),

  // Set table loading state
  setTableLoading: (isLoading) =>
    set({ isTableLoading: isLoading }),

  // Set CSV file
  setCsvFile: (file) =>
    set({ csvFile: file }),

  // Set CSV headers
  setCsvHeaders: (headers) =>
    set({ csvHeaders: headers }),

  // Set parsing state
  setIsParsing: (isParsing) =>
    set({ isParsing: isParsing }),

  // Clear CSV data
  clearCsvData: () =>
    set({
      csvFile: null,
      csvHeaders: [],
      isParsing: false,
    }),
}));