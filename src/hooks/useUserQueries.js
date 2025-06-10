import { useQuery } from "@tanstack/react-query";
import { userService } from "../services/userService";

export function useUserQueries() {
  // Query for fetching all patients
  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: userService.getPatients,
    initialData: [], // Initialize with empty array
    refetchOnMount: true, // Add this to refetch when component mounts
    staleTime: 0, // Data is considered stale immediately
    cacheTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  return {
    // Queries
    patients: patientsQuery.data || [], // Ensure we always return an array
    isLoading: patientsQuery.isLoading,
    isError: patientsQuery.isError,
    error: patientsQuery.error,
    refetch: patientsQuery.refetch,
  };
}
