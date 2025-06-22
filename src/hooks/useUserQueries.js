import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../services/userService";
import { notifications } from "@mantine/notifications";

export function useUserQueries() {
  const queryClient = useQueryClient();

  // Query for fetching all patients
  const patientsQuery = useQuery({
    queryKey: ["patients"],
    queryFn: userService.getPatients,
    initialData: [], // Initialize with empty array
    refetchOnMount: true, // Add this to refetch when component mounts
    staleTime: 0, // Data is considered stale immediately
    cacheTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Mutation for banning a patient
  const banPatientMutation = useMutation({
    mutationFn: userService.banPatient,
    onMutate: async (patientId) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["patients"] });

      // Snapshot the previous value
      const previousPatients = queryClient.getQueryData(["patients"]);

      // Optimistically update the patient to banned
      queryClient.setQueryData(["patients"], (oldPatients) =>
        oldPatients.map((patient) =>
          patient.id === patientId ? { ...patient, isBanned: true } : patient
        )
      );

      // Return context object with the snapshot
      return { previousPatients };
    },
    onSuccess: () => {
      // Refetch to ensure server state is in sync
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      notifications.show({
        title: "Success",
        message: "Patient has been banned",
        color: "red",
      });
    },
    onError: (error, patientId, context) => {
      // Rollback to the previous state on error
      queryClient.setQueryData(["patients"], context.previousPatients);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to ban patient",
        color: "red",
      });
    },
  });

  // Mutation for unbanning a patient
  const unbanPatientMutation = useMutation({
    mutationFn: userService.unbanPatient,
    onMutate: async (patientId) => {
      // Cancel outgoing refetches so they don't overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ["patients"] });

      // Snapshot the previous value
      const previousPatients = queryClient.getQueryData(["patients"]);

      // Optimistically update the patient to unbanned
      queryClient.setQueryData(["patients"], (oldPatients) =>
        oldPatients.map((patient) =>
          patient.id === patientId ? { ...patient, isBanned: false } : patient
        )
      );

      // Return context object with the snapshot
      return { previousPatients };
    },
    onSuccess: () => {
      // Refetch to ensure server state is in sync
      queryClient.invalidateQueries({ queryKey: ["patients"] });
      notifications.show({
        title: "Success",
        message: "Patient has been unbanned",
        color: "green",
      });
    },
    onError: (error, patientId, context) => {
      // Rollback to the previous state on error
      queryClient.setQueryData(["patients"], context.previousPatients);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to unban patient",
        color: "red",
      });
    },
  });

  return {
    // Queries
    patients: patientsQuery.data || [], // Ensure we always return an array
    isLoading: patientsQuery.isLoading,
    isError: patientsQuery.isError,
    error: patientsQuery.error,
    refetch: patientsQuery.refetch,

    // Mutations
    banPatient: banPatientMutation.mutate,
    unbanPatient: unbanPatientMutation.mutate,
  };
}
