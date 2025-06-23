import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicsService } from "../services/clinicsService";
import { appointmentService } from "../services/appointmentService";
import { notifications } from "@mantine/notifications";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

// Constants
export const DAYS_CONFIG = [
  { day: "Sunday", letter: "S", value: 0 },
  { day: "Monday", letter: "M", value: 1 },
  { day: "Tuesday", letter: "T", value: 2 },
  { day: "Wednesday", letter: "W", value: 3 },
  { day: "Thursday", letter: "T", value: 4 },
  { day: "Friday", letter: "F", value: 5 },
  { day: "Saturday", letter: "S", value: 6 },
];

// Utility functions
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

const isWorkingDay = (dayData) => {
  return dayData?.startTime !== "00:00:00" && dayData?.endTime !== "00:00:00";
};

const createEmptySchedule = () => {
  const schedule = {};
  DAYS_CONFIG.forEach((dayConfig) => {
    schedule[dayConfig.day] = {
      isAvailable: false,
      from: "",
      to: "",
    };
  });
  return schedule;
};

// Data transformation functions
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
    return createEmptySchedule();
  }

  const componentFormat = {};

  DAYS_CONFIG.forEach((dayConfig) => {
    const dayData = doctorObject.workingHours.find(
      (item) => item.dayOfWeek === dayConfig.value
    );

    if (dayData && isWorkingDay(dayData)) {
      componentFormat[dayConfig.day] = {
        isAvailable: true,
        from: convertUTCToLocal(dayData.startTime),
        to: convertUTCToLocal(dayData.endTime),
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

const convertToTableFormat = (apiData) => {
  const doctorsWorkingDays = {};

  apiData.forEach((doctorObject) => {
    const doctorId = doctorObject.doctorId;
    const workingDays = [];

    if (doctorObject.workingHours?.length > 0) {
      doctorObject.workingHours.forEach((dayData) => {
        if (isWorkingDay(dayData)) {
          workingDays.push(dayData.dayOfWeek);
        }
      });
    } else {
      // If no working hours are set, doctor is available all days (0-6)
      workingDays.push(0, 1, 2, 3, 4, 5, 6);
    }

    doctorsWorkingDays[doctorId] = workingDays;
  });

  return doctorsWorkingDays;
};

// Shared query function
const fetchAllDoctorsWorkingHours = () => {
  return appointmentService.getAllDoctorsWorkingHours();
};

// Main hooks
export function useWorkingHoursQueries(doctorId) {
  const queryClient = useQueryClient();

  const workingHoursQuery = useQuery({
    queryKey: ["working-hours", doctorId],
    queryFn: async () => {
      const allDoctorsWorkingHours = await fetchAllDoctorsWorkingHours();
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

  const updateWorkingHours = useMutation({
    mutationFn: clinicsService.updateDoctorWorkingHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-hours", doctorId] });
      queryClient.invalidateQueries({
        queryKey: ["all-doctors-working-hours"],
      });
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

  const createWorkingHours = useMutation({
    mutationFn: clinicsService.createDoctorWorkingHours,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["working-hours", doctorId] });
      queryClient.invalidateQueries({
        queryKey: ["all-doctors-working-hours"],
      });
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

export function useAllDoctorsWorkingHours() {
  const workingHoursQuery = useQuery({
    queryKey: ["all-doctors-working-hours"],
    queryFn: async () => {
      const allDoctorsWorkingHours = await fetchAllDoctorsWorkingHours();
      return convertToTableFormat(allDoctorsWorkingHours);
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    onError: (error) => {
      console.error("Error fetching all doctors working hours:", error);
    },
  });

  return {
    doctorsWorkingDays: workingHoursQuery.data || {},
    isLoading: workingHoursQuery.isLoading,
    error: workingHoursQuery.error,
  };
}
