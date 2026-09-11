import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiState {
  isSidebarCollapsed: boolean;
  activeModal: string | null;
  autoplayVideos: boolean;
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setAutoplayVideos: (autoplayVideos: boolean) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      activeModal: null,
      autoplayVideos: true,
      toggleSidebar: () =>
        set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
      openModal: (modalId) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null }),
      setAutoplayVideos: (autoplayVideos) => set({ autoplayVideos }),
    }),
    {
      name: "memora-ui-preferences",
      partialize: (state) => ({
        autoplayVideos: state.autoplayVideos,
        isSidebarCollapsed: state.isSidebarCollapsed,
      }),
    },
  ),
);
