import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "../services/clinicsService";
import { appointmentService } from "../services/appointmentService";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const DAYS_CONFIG = [
  { day: "Sunday", letter: "S", value: 0 },
  { day: "Monday", letter: "M", value: 1 },
  { day: "Tuesday", letter: "T", value: 2 },
  { day: "Wednesday", letter: "W", value: 3 },
  { day: "Thursday", letter: "T", value: 4 },
  { day: "Friday", letter: "F", value: 5 },
  { day: "Saturday", letter: "S", value: 6 },
];

// Convert UTC time to local time
const convertUTCToLocal = (utcTimeString) => {
  if (!utcTimeString || utcTimeString === "00:00:00") return "";

  try {
    const today = dayjs().format("YYYY-MM-DD");
    const utcDateTime = dayjs.utc(`${today} ${utcTimeString}`);
    const localTime = utcDateTime.tz(dayjs.tz.guess());
    return localTime.format("HH:mm");
  } catch (error) {
    console.error("Error converting UTC to local time:", error);
    return "";
  }
};

// Convert API working hours data to component format
const convertApiDataToComponentFormat = (apiData, targetDoctorId) => {
  const doctorObject = apiData.find(
    (doctor) => doctor.doctorId === Number(targetDoctorId)
  );

  if (!doctorObject) {
    console.log(`Doctor ${targetDoctorId} not found in API response`);
    return null;
  }

  if (!doctorObject.workingHours || doctorObject.workingHours.length === 0) {
    console.log(
      `Doctor ${doctorObject.doctorName} (ID: ${targetDoctorId}) has no working hours set`
    );
    if (doctorObject.message) {
      console.log(`API Message: ${doctorObject.message}`);
    }
    const emptySchedule = {};
    DAYS_CONFIG.forEach((dayConfig) => {
      emptySchedule[dayConfig.day] = {
        isAvailable: false,
        from: "",
        to: "",
      };
    });
    return emptySchedule;
  }

  const componentFormat = {};

  DAYS_CONFIG.forEach((dayConfig) => {
    const dayData = doctorObject.workingHours.find(
      (item) => item.dayOfWeek === dayConfig.value
    );

    if (dayData) {
      const startTime =
        dayData.startTime && dayData.startTime !== "00:00:00"
          ? convertUTCToLocal(dayData.startTime)
          : "";
      const endTime =
        dayData.endTime && dayData.endTime !== "00:00:00"
          ? convertUTCToLocal(dayData.endTime)
          : "";
      const isAvailable =
        dayData.startTime !== "00:00:00" && dayData.endTime !== "00:00:00";

      componentFormat[dayConfig.day] = {
        isAvailable,
        from: startTime,
        to: endTime,
      };
    } else {
      componentFormat[dayConfig.day] = {
        isAvailable: false,
        from: "",
        to: "",
      };
    }
  });

  return componentFormat;
};

export function useWorkingHoursQueries(doctorId) {
  const queryClient = useQueryClient();

  // Query for fetching working hours
  const workingHoursQuery = useQuery({
    queryKey: ["working-hours", doctorId],
    queryFn: async () => {
      const allDoctorsWorkingHours =
        await appointmentService.getAllDoctorsWorkingHours();
      return convertApiDataToComponentFormat(allDoctorsWorkingHours, doctorId);
    },
    enabled: !!doctorId,
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: "Failed to load working hours",
        color: "red",
      });
    },
  });

  // Mutation for updating working hours
  const updateWorkingHours = useMutation({
    mutationFn: clinicsService.updateDoctorWorkingHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-hours", doctorId] });
      notifications.show({
        title: "Success",
        message: "Working hours updated successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update working hours",
        color: "red",
      });
    },
  });

  // Mutation for creating working hours
  const createWorkingHours = useMutation({
    mutationFn: clinicsService.createDoctorWorkingHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-hours", doctorId] });
      notifications.show({
        title: "Success",
        message: "Working hours created successfully",
        color: "green",
      });
    },
    onError: (error) => {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create working hours",
        color: "red",
      });
    },
  });

  return {
    workingHours: workingHoursQuery.data,
    isLoading: workingHoursQuery.isLoading,
    error: workingHoursQuery.error,
    updateWorkingHours: updateWorkingHours.mutate,
    createWorkingHours: createWorkingHours.mutate,
    isUpdating: updateWorkingHours.isPending,
    isCreating: createWorkingHours.isPending,
  };
}
