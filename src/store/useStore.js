import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const useStore = create(
  devtools(
    persist(
      set => ({
        // State
        count: 0,
        user: null,
        isLoading: false,
        error: null,

        // Actions
        increment: () => set(state => ({ count: state.count + 1 })),
        decrement: () => set(state => ({ count: state.count - 1 })),

        // User actions
        setUser: user => set({ user }),
        clearUser: () => set({ user: null }),

        // Loading and error states
        setLoading: isLoading => set({ isLoading }),
        setError: error => set({ error }),
        clearError: () => set({ error: null }),

        // Reset store
        reset: () =>
          set({
            count: 0,
            user: null,
            isLoading: false,
            error: null,
          }),
      }),
      {
        name: 'app-store', // unique name for localStorage
        version: 1, // version number for the store
      }
    )
  )
);

export default useStore;
