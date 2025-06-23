import { useEffect } from "react";
import useAuthStore from "../store/useAuthStore";

export const useInitAuth = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  useEffect(() => {
    // Only initialize auth after hydration is complete
    if (hasHydrated) {
      initializeAuth();
    }
  }, [initializeAuth, hasHydrated]);

  return { isLoading: isLoading || !hasHydrated };
};
