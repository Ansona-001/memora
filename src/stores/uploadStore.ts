import { create } from "zustand";

import type { UploadQueueItem, UploadStatus } from "@/types/media";

interface UploadState {
  items: UploadQueueItem[];
  addItems: (items: UploadQueueItem[]) => void;
  updateItem: (id: string, updates: Partial<UploadQueueItem>) => void;
  setStatus: (
    id: string,
    status: UploadStatus,
    extra?: Partial<UploadQueueItem>,
  ) => void;
  removeItem: (id: string) => void;
  clearCompleted: () => void;
}

export const useUploadStore = create<UploadState>((set) => ({
  items: [],

  addItems: (items) => set((state) => ({ items: [...state.items, ...items] })),

  updateItem: (id, updates) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, ...updates } : item,
      ),
    })),

  setStatus: (id, status, extra) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, status, ...extra } : item,
      ),
    })),

  removeItem: (id) =>
    set((state) => {
      const item = state.items.find((entry) => entry.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return { items: state.items.filter((entry) => entry.id !== id) };
    }),

  clearCompleted: () =>
    set((state) => {
      for (const item of state.items) {
        if (item.status === "success") {
          URL.revokeObjectURL(item.previewUrl);
        }
      }
      return {
        items: state.items.filter((item) => item.status !== "success"),
      };
    }),
}));
