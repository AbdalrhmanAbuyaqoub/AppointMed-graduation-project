import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { appointmentService } from "../services/appointmentService";

export function useAppointmentQueries() {
  const queryClient = useQueryClient();

  // Query for fetching all appointments
  const {
    data: appointments = [],
    isLoading: isLoadingAppointments,
    error: appointmentsError,
  } = useQuery({
    queryKey: ["appointments"],
    queryFn: appointmentService.getAllAppointments,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
    staleTime: 0,
  });

  // Query for fetching a single appointment
  const getAppointmentById = (id) => {
    return useQuery({
      queryKey: ["appointment", id],
      queryFn: () => appointmentService.getAppointmentById(id),
      enabled: !!id,
    });
  };

  // Query for fetching appointments by clinic
  const getAppointmentsByClinic = (clinicId) => {
    return useQuery({
      queryKey: ["appointments", "clinic", clinicId],
      queryFn: () => appointmentService.getAppointmentsByClinic(clinicId),
      enabled: !!clinicId,
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      staleTime: 0,
    });
  };

  // Query for fetching appointments by doctor
  const getAppointmentsByDoctor = (doctorId) => {
    return useQuery({
      queryKey: ["appointments", "doctor", doctorId],
      queryFn: () => appointmentService.getAppointmentsByDoctor(doctorId),
      enabled: !!doctorId,
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      staleTime: 0,
    });
  };

  // Query for fetching appointments by user
  const getAppointmentsByUser = (userId) => {
    return useQuery({
      queryKey: ["appointments", "user", userId],
      queryFn: () => appointmentService.getAppointmentsByUser(userId),
      enabled: !!userId,
      refetchInterval: 30000,
      refetchOnWindowFocus: true,
      staleTime: 0,
    });
  };

  // Mutation for creating a new appointment
  const createAppointment = useMutation({
    mutationFn: appointmentService.createAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] });
    },
  });

  // Mutation for creating a new appointment with patient
  const createAppointmentWithPatient = useMutation({
    mutationFn: appointmentService.createAppointmentWithPatient,
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "appointments",
      });

      if (response?.appointment?.doctorId) {
        queryClient.invalidateQueries({
          queryKey: ["appointments", "doctor", response.appointment.doctorId],
        });
      }

      // Store user ID if a new user was created
      if (response?.appointment?.userId) {
        localStorage.setItem("lastPatientUserId", response.appointment.userId);
      }
    },
  });

  // Mutation for updating an appointment
  const updateAppointment = useMutation({
    mutationFn: appointmentService.updateAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "appointments",
      });
    },
  });

  // Mutation for deleting an appointment
  const deleteAppointment = useMutation({
    mutationFn: appointmentService.deleteAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "appointments",
      });
    },
  });

  return {
    // Queries
    appointments,
    isLoadingAppointments,
    appointmentsError,
    getAppointmentById,
    getAppointmentsByClinic,
    getAppointmentsByDoctor,
    getAppointmentsByUser,

    // Mutations
    createAppointment,
    createAppointmentWithPatient,
    updateAppointment,
    deleteAppointment,
  };
}
