import { create } from "zustand";

const useSearchStore = create((set, get) => ({
  searchQuery: "",
  currentPage: null,

  setSearchQuery: (query) => set(() => ({ searchQuery: query })),

  setCurrentPage: (page) =>
    set((state) => {
      // Clear search when changing pages
      if (state.currentPage && state.currentPage !== page) {
        return { currentPage: page, searchQuery: "" };
      }
      return { currentPage: page };
    }),

  clearSearch: () => set(() => ({ searchQuery: "" })),

  getPlaceholder: (page) => {
    const placeholders = {
      appointments: "Search by patient name or appointment ID...",
      patients: "Search patients...",
      doctors: "Search doctors...",
      clinics: "Search clinics...",
    };
    return placeholders[page] || "Search...";
  },
}));

export default useSearchStore;
