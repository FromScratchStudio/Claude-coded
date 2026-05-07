import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface StoreState {
  sources: string[];
  activeSource: string | null;
  selectedTitleId: string | null;
  selectedChapterId: string | null;
  searchQuery: string;
  selectedGenre: string;
  immersiveMode: boolean;
  readerDisplayMode: "default" | "booklet" | "paged";
}

interface StoreActions {
  ensureSource: (url: string) => void;
  addSource: (url: string) => void;
  removeSource: (url: string) => void;
  setActiveSource: (url: string) => void;
  selectTitle: (id: string | null) => void;
  selectChapter: (id: string | null) => void;
  setSearchQuery: (value: string) => void;
  setSelectedGenre: (value: string) => void;
  toggleImmersiveMode: () => void;
  setReaderDisplayMode: (mode: "default" | "booklet" | "paged") => void;
}

export const useStore = create<StoreState & StoreActions>()(
  persist(
    (set) => ({
      sources: [],
      activeSource: null,
      selectedTitleId: null,
      selectedChapterId: null,
      searchQuery: "",
      selectedGenre: "all",
      immersiveMode: false,
      readerDisplayMode: "default",
      ensureSource: (url) =>
        set((state) => {
          if (state.sources.includes(url)) {
            return state.activeSource ? {} : { activeSource: url };
          }
          return {
            sources: [url, ...state.sources],
            activeSource: state.activeSource ?? url,
          };
        }),
      addSource: (url) =>
        set((state) => {
          if (state.sources.includes(url)) {
            return { activeSource: url };
          }
          return {
            sources: [url, ...state.sources],
            activeSource: url,
          };
        }),
      removeSource: (url) =>
        set((state) => {
          const sources = state.sources.filter((entry) => entry !== url);
          const activeSource = state.activeSource === url ? sources[0] ?? null : state.activeSource;
          return { sources, activeSource };
        }),
      setActiveSource: (url) =>
        set({ activeSource: url, selectedTitleId: null, selectedChapterId: null }),
      selectTitle: (id) => set({ selectedTitleId: id, selectedChapterId: null }),
      selectChapter: (id) => set({ selectedChapterId: id }),
      setSearchQuery: (value) => set({ searchQuery: value }),
      setSelectedGenre: (value) => set({ selectedGenre: value }),
      toggleImmersiveMode: () =>
        set((state) => ({
          immersiveMode: !state.immersiveMode,
        })),
      setReaderDisplayMode: (mode) => set({ readerDisplayMode: mode }),
    }),
    {
      name: "generic-comics-publish-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
