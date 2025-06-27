import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Text,
  Avatar,
  TextInput,
  ActionIcon,
  Group,
  Stack,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconX, IconDeviceFloppy } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import TimezoneSelect from "react-timezone-select";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useWorkingHoursQueries } from "../../hooks/useWorkingHoursQueries";

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

// Convert local time to UTC considering the selected timezone
const convertTimeToUTC = (timeString, selectedTimezone) => {
  if (!timeString) return "00:00:00";

  // Get the timezone value
  const timeZone = selectedTimezone?.value || dayjs.tz.guess();

  // Create a date for today with the time in the selected timezone
  const today = dayjs().format("YYYY-MM-DD");
  const dateTimeString = `${today} ${timeString}`;

  // Parse the time in the selected timezone and convert to UTC
  const utcTime = dayjs.tz(dateTimeString, timeZone).utc();

  // Format as HH:mm:ss
  return utcTime.format("HH:mm:ss");
};

const WorkingHours = ({ doctorId }) => {
  console.log("WorkingHours component rendered with doctorId:", doctorId);
  const theme = useMantineTheme();
  const [availableDays, setAvailableDays] = useState(null);
  const [initialWorkingHours, setInitialWorkingHours] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState({
    value: Intl.DateTimeFormat().resolvedOptions().timeZone,
    label: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
  const [isInitialState, setIsInitialState] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    workingHours,
    isLoading: isLoadingHours,
    error: workingHoursError,
    updateWorkingHours,
    createWorkingHours,
    isUpdating,
    isCreating,
  } = useWorkingHoursQueries(doctorId);

  // Debounce implementation
  const useDebounce = (callback, delay) => {
    const timeoutRef = useRef(null);

    return useCallback(
      (...args) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          callback(...args);
        }, delay);
      },
      [callback, delay]
    );
  };

  const hasWorkingHoursChanged = (currentHours) => {
    return JSON.stringify(currentHours) !== JSON.stringify(initialWorkingHours);
  };

  // Load doctor's working hours
  useEffect(() => {
    if (workingHours) {
      setAvailableDays(workingHours);
      setInitialWorkingHours(workingHours);

      // Check if this is an initial state (no working hours assigned)
      const hasAnyAvailableDay = Object.values(workingHours).some(
        (day) => day.isAvailable
      );
      setIsInitialState(!hasAnyAvailableDay);
    }
  }, [workingHours]);

  // Show error notification if working hours failed to load
  useEffect(() => {
    if (workingHoursError) {
      notifications.show({
        title: "Error",
        message: "Failed to load working hours",
        color: "red",
      });
    }
  }, [workingHoursError]);

  const saveWorkingHours = async (currentHours) => {
    if (!hasWorkingHoursChanged(currentHours)) {
      return;
    }

    try {
      const workingHoursData = DAYS_CONFIG.map((dayConfig) => {
        const dayData = currentHours[dayConfig.day];
        return {
          doctorId: Number(doctorId),
          dayOfWeek: dayConfig.value,
          startTime: dayData.isAvailable
            ? convertTimeToUTC(dayData.from, selectedTimezone)
            : "00:00:00",
          endTime: dayData.isAvailable
            ? convertTimeToUTC(dayData.to, selectedTimezone)
            : "00:00:00",
        };
      });

      // Check if we need to create or update
      const hasExistingHours =
        initialWorkingHours &&
        Object.values(initialWorkingHours).some((day) => day.isAvailable);

      if (hasExistingHours) {
        await updateWorkingHours(workingHoursData);
      } else {
        await createWorkingHours(workingHoursData);
      }

      setInitialWorkingHours(currentHours);
      setHasUnsavedChanges(true);
      debouncedSuccessNotification(); // Show success notification after all changes
    } catch (error) {
      console.error("Error saving working hours:", error);
      // Error notification is already handled by the mutation
    }
  };

  // Create debounced save function
  const debouncedSave = useDebounce((currentHours) => {
    saveWorkingHours(currentHours);
  }, 500); // Save after 500ms of no changes for faster auto-update

  // Auto-save when availableDays changes
  useEffect(() => {
    if (
      availableDays &&
      initialWorkingHours &&
      hasWorkingHoursChanged(availableDays)
    ) {
      debouncedSave(availableDays);
    }
  }, [availableDays, initialWorkingHours, debouncedSave]);

  // Debounced notification for success
  const debouncedSuccessNotification = useDebounce(() => {
    if (hasUnsavedChanges) {
      notifications.show({
        title: "Success",
        message: "Working hours saved successfully",
        color: "green",
      });
      setHasUnsavedChanges(false);
    }
  }, 1000); // Show success notification 1 second after last change

  const handleToggleDay = (day) => {
    setAvailableDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        isAvailable: !prev[day].isAvailable,
        from: !prev[day].isAvailable ? "09:00" : "",
        to: !prev[day].isAvailable ? "17:00" : "",
      },
    }));
  };

  const validateTimeFormat = (time) => {
    if (!time) return true;
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleTimeChange = (day, field, value) => {
    if (!validateTimeFormat(value)) {
      notifications.show({
        title: "Invalid Time Format",
        message: "Please use HH:mm format (e.g., 09:00)",
        color: "red",
      });
      return;
    }

    setAvailableDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  if (isLoadingHours) {
    return <Text>Loading working hours...</Text>;
  }

  if (!availableDays) {
    return (
      <Stack gap={"lg"}>
        <Text c="dimmed" ta="center">
          No working hours data available for this doctor.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack gap={"lg"}>
      {DAYS_CONFIG.map((item) => (
        <Group key={item.day} gap={"xl"}>
          <Avatar color={theme.primaryColor} size={35} variant="filled">
            {item.letter}
          </Avatar>
          {availableDays[item.day].isAvailable ? (
            <Group>
              <TextInput
                w={80}
                value={availableDays[item.day].from}
                onChange={(e) =>
                  handleTimeChange(item.day, "from", e.target.value)
                }
                placeholder="HH:mm"
                maxLength={5}
              />
              <Text> - </Text>
              <TextInput
                w={80}
                value={availableDays[item.day].to}
                onChange={(e) =>
                  handleTimeChange(item.day, "to", e.target.value)
                }
                placeholder="HH:mm"
                maxLength={5}
              />
              <ActionIcon
                color="black"
                variant="subtle"
                radius={"sm"}
                onClick={() => handleToggleDay(item.day)}
              >
                <IconX size={20} stroke={1.5} />
              </ActionIcon>
            </Group>
          ) : (
            <Group>
              <Text c="dimmed">
                {isInitialState ? "Not Assigned" : "Unavailable"}
              </Text>
              <ActionIcon
                color="black"
                variant="subtle"
                radius={"sm"}
                onClick={() => {
                  handleToggleDay(item.day);
                  // Once user starts setting working hours, it's no longer initial state
                  if (isInitialState) {
                    setIsInitialState(false);
                  }
                }}
              >
                <IconPlus size={20} stroke={1.5} />
              </ActionIcon>
            </Group>
          )}
        </Group>
      ))}
      <Box>
        <TimezoneSelect
          value={selectedTimezone}
          onChange={setSelectedTimezone}
          labelStyle="offsetHidden"
          label
          styles={{
            container: (baseStyles) => ({
              ...baseStyles,
              width: "max-content",
            }),
            control: (baseStyles) => ({
              ...baseStyles,
              border: "none",
              boxShadow: "none",
              background: "transparent",
              minHeight: "30px",
              cursor: "pointer",
              "&:hover": {
                border: "none",
              },
            }),
            dropdownIndicator: (baseStyles) => ({
              ...baseStyles,
              color: `var(--mantine-color-${theme.primaryColor}-9)`,
              "&:hover": {
                color: `var(--mantine-color-${theme.primaryColor}-8)`,
              },
            }),
            indicatorSeparator: () => ({
              display: "none",
            }),
            singleValue: (baseStyles) => ({
              ...baseStyles,
              color: `var(--mantine-color-${theme.primaryColor}-9)`,
            }),
            option: (baseStyles, { isSelected, isFocused }) => ({
              ...baseStyles,
              backgroundColor: isSelected
                ? `var(--mantine-color-${theme.primaryColor}-6)`
                : isFocused
                ? `var(--mantine-color-${theme.primaryColor}-0)`
                : "transparent",
              color: isSelected ? "white" : baseStyles.color,
              "&:hover": {
                backgroundColor: `var(--mantine-color-${theme.primaryColor}-${
                  isSelected ? 7 : 1
                })`,
              },
            }),
            menu: (baseStyles) => ({
              ...baseStyles,
              width: "max-content",
              minWidth: "100%",
            }),
          }}
        />
      </Box>
    </Stack>
  );
};

export default WorkingHours;
