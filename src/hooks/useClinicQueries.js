import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "../services/clinicsService";
import { notifications } from "@mantine/notifications";

export function useClinicQueries(clinicId) {
  const queryClient = useQueryClient();

  // Query for fetching all clinics
  const clinicsQuery = useQuery({
    queryKey: ["clinics"],
    queryFn: clinicsService.getAllClinics,
    initialData: [], // Initialize with empty array
    refetchOnMount: true, // Add this to refetch when component mounts
    staleTime: 0, // Data is considered stale immediately
    cacheTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  // Query for fetching a single clinic
  const clinicQuery = useQuery({
    queryKey: ["clinic", clinicId],
    queryFn: () => clinicsService.getClinicById(clinicId),
    enabled: !!clinicId, // Only run if clinicId is provided
  });

  // Query for fetching clinic doctors
  const doctorsQuery = useQuery({
    queryKey: ["clinic-doctors", clinicId],
    queryFn: () => clinicsService.getDoctors(clinicId),
    enabled: !!clinicId, // Only run if clinicId is provided
  });

  // Mutation for creating a clinic
  const createClinicMutation = useMutation({
    mutationFn: (data) => clinicsService.createClinic(data),
    onSuccess: (newClinic) => {
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      notifications.show({
        title: "Success",
        message: "Clinic created successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create clinic",
        color: "red",
      });
    },
  });

  // Mutation for updating a clinic
  const updateClinicMutation = useMutation({
    mutationFn: (data) => clinicsService.updateClinic(data),
    onSuccess: (_, variables) => {
      // Invalidate both the clinics list and the specific clinic
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({ queryKey: ["clinic", variables.id] });
      notifications.show({
        title: "Success",
        message: "Clinic updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update clinic",
        color: "red",
      });
    },
  });

  // Mutation for adding a doctor
  const addDoctorMutation = useMutation({
    mutationFn: (data) => clinicsService.addDoctor(data),
    onSuccess: (data, variables) => {
      // Invalidate both the clinics list and the specific clinic's doctors
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({
        queryKey: ["clinic", variables.clinicId],
      });
      queryClient.invalidateQueries({
        queryKey: ["clinic-doctors", variables.clinicId],
      });
      notifications.show({
        title: "Success",
        message: "Doctor added successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to add doctor",
        color: "red",
      });
    },
  });

  // Mutation for deleting a clinic
  const deleteClinicMutation = useMutation({
    mutationFn: (id) => clinicsService.deleteClinic(id),
    onSuccess: (_, id) => {
      // Invalidate the clinics list
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      notifications.show({
        title: "Success",
        message: "Clinic deleted successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete clinic",
        color: "red",
      });
    },
  });

  // Mutation for updating a doctor
  const updateDoctorMutation = useMutation({
    mutationFn: (data) => clinicsService.updateDoctor(data),
    onSuccess: (_, variables) => {
      // Invalidate both the clinics list and the specific clinic's doctors
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      queryClient.invalidateQueries({
        queryKey: ["clinic-doctors", variables.clinicId],
      });
      notifications.show({
        title: "Success",
        message: "Doctor updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update doctor",
        color: "red",
      });
    },
  });

  // Mutation for deleting a doctor
  const deleteDoctorMutation = useMutation({
    mutationFn: (id) => clinicsService.deleteDoctor(id),
    onSuccess: (_, id) => {
      // Invalidate the clinics list
      queryClient.invalidateQueries({ queryKey: ["clinics"] });
      notifications.show({
        title: "Success",
        message: "Doctor deleted successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete doctor",
        color: "red",
      });
    },
  });

  return {
    // Queries
    clinics: clinicsQuery.data || [], // Ensure we always return an array
    clinic: clinicQuery.data,
    doctors: doctorsQuery.data || [], // Ensure we always return an array for doctors
    isLoading:
      clinicsQuery.isLoading || clinicQuery.isLoading || doctorsQuery.isLoading,
    isError:
      clinicsQuery.isError || clinicQuery.isError || doctorsQuery.isError,
    error: clinicsQuery.error || clinicQuery.error || doctorsQuery.error,

    // Mutations
    createClinic: createClinicMutation.mutateAsync,
    updateClinic: updateClinicMutation.mutateAsync,
    addDoctor: addDoctorMutation.mutateAsync,
    deleteClinic: deleteClinicMutation.mutateAsync,
    updateDoctor: updateDoctorMutation.mutateAsync,
    deleteDoctor: deleteDoctorMutation.mutateAsync,

    // Mutation states
    isCreating: createClinicMutation.isPending,
    isUpdating: updateClinicMutation.isPending,
    isAddingDoctor: addDoctorMutation.isPending,
    isDeleting: deleteClinicMutation.isPending,
    isUpdatingDoctor: updateDoctorMutation.isPending,
    isDeletingDoctor: deleteDoctorMutation.isPending,
  };
}
