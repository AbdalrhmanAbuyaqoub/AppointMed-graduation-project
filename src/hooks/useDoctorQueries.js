import { useClinicQueries } from "./useClinicQueries";

export function useDoctorQueries() {
  const {
    clinics,
    isLoading,
    addDoctor,
    isAddingDoctor,
    updateDoctor,
    deleteDoctor,
    isUpdatingDoctor,
    isDeletingDoctor,
  } = useClinicQueries();

  // Extract all doctors from all clinics
  const allDoctors = clinics.reduce((acc, clinic) => {
    if (clinic.doctors) {
      return [
        ...acc,
        ...clinic.doctors.map((doctor) => ({
          ...doctor,
          clinicId: clinic.id,
          clinicName: clinic.name,
        })),
      ];
    }
    return acc;
  }, []);

  return {
    doctors: allDoctors,
    isLoading,
    isCreating: isAddingDoctor,
    createDoctor: addDoctor,
    updateDoctor,
    deleteDoctor,
    isUpdating: isUpdatingDoctor,
    isDeleting: isDeletingDoctor,
  };
}
