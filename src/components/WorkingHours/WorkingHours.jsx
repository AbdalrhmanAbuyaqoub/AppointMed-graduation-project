import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Box,
  Text,
  Avatar,
  TextInput,
  ActionIcon,
  Group,
  Stack,
  useMantineTheme,
} from "@mantine/core";
import { IconPlus, IconX } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import TimezoneSelect from "react-timezone-select";

const DAYS_CONFIG = [
  { day: "Sunday", letter: "S" },
  { day: "Monday", letter: "M" },
  { day: "Tuesday", letter: "T" },
  { day: "Wednesday", letter: "W" },
  { day: "Thursday", letter: "T" },
  { day: "Friday", letter: "F" },
  { day: "Saturday", letter: "S" },
];

const DEFAULT_WORKING_HOURS = {
  Sunday: { isAvailable: true, from: "09:00", to: "17:00" },
  Monday: { isAvailable: true, from: "09:00", to: "17:00" },
  Tuesday: { isAvailable: true, from: "09:00", to: "17:00" },
  Wednesday: { isAvailable: true, from: "09:00", to: "17:00" },
  Thursday: { isAvailable: true, from: "09:00", to: "17:00" },
  Friday: { isAvailable: false, from: "09:00", to: "17:00" },
  Saturday: { isAvailable: true, from: "09:00", to: "17:00" },
};

const WorkingHours = ({ doctorId }) => {
  const theme = useMantineTheme();
  const [availableDays, setAvailableDays] = useState(DEFAULT_WORKING_HOURS);
  const [initialWorkingHours, setInitialWorkingHours] = useState(null);
  const [isLoadingHours, setIsLoadingHours] = useState(true);
  const [selectedTimezone, setSelectedTimezone] = useState({
    value: Intl.DateTimeFormat().resolvedOptions().timeZone,
    label: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });

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
    const loadWorkingHours = async () => {
      try {
        const savedHours = localStorage.getItem(`doctor_${doctorId}_hours`);
        const doctorHours = savedHours
          ? JSON.parse(savedHours)
          : DEFAULT_WORKING_HOURS;

        setAvailableDays(doctorHours);
        setInitialWorkingHours(doctorHours);
        setIsLoadingHours(false);
      } catch (error) {
        console.error("Error loading working hours:", error);
        notifications.show({
          title: "Error",
          message: "Failed to load working hours",
          color: "red",
        });
        setIsLoadingHours(false);
      }
    };

    if (doctorId) {
      loadWorkingHours();
    }
  }, [doctorId]);

  const saveWorkingHours = async (currentHours) => {
    if (!hasWorkingHoursChanged(currentHours)) {
      console.log("No changes detected in working hours");
      return;
    }

    try {
      const workingHours = Object.entries(currentHours).map(
        ([day, schedule]) => ({
          day,
          isAvailable: schedule.isAvailable,
          from: schedule.isAvailable ? schedule.from : null,
          to: schedule.isAvailable ? schedule.to : null,
        })
      );

      console.log("Saving working hours changes:", workingHours);
      localStorage.setItem(
        `doctor_${doctorId}_hours`,
        JSON.stringify(currentHours)
      );
      setInitialWorkingHours(currentHours);

      notifications.show({
        title: "Success",
        message: "Working hours updated",
        color: "green",
      });
    } catch (error) {
      console.error("Error saving working hours:", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update working hours",
        color: "red",
      });
    }
  };

  // Create a debounced version of saveWorkingHours
  const debouncedSave = useDebounce(saveWorkingHours, 1000);

  // Auto-save effect
  useEffect(() => {
    if (Object.keys(availableDays).length > 0) {
      debouncedSave(availableDays);
    }
  }, [availableDays]);

  const handleToggleDay = (day) => {
    setAvailableDays((prev) => {
      const newState = {
        ...prev,
        [day]: {
          ...prev[day],
          isAvailable: !prev[day].isAvailable,
        },
      };
      console.log(`Day ${day} availability changed:`, newState[day]);
      return newState;
    });
  };

  const validateTimeFormat = (time) => {
    // Allow empty input for clearing
    if (!time) return true;

    // Allow partial input while typing
    if (time.length < 5) return true;

    // Only validate complete time entries (HH:mm)
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const handleTimeChange = (day, field, value) => {
    // Only show error for complete invalid times
    if (value.length === 5 && !validateTimeFormat(value)) {
      notifications.show({
        title: "Invalid Time Format",
        message: "Please use HH:mm format (e.g., 09:00)",
        color: "red",
      });
      return;
    }

    // Auto-add colon after hours
    if (value.length === 2 && !value.includes(":")) {
      value = value + ":";
    }

    setAvailableDays((prev) => {
      const newState = {
        ...prev,
        [day]: {
          ...prev[day],
          [field]: value,
        },
      };
      console.log(`Time updated for ${day}:`, {
        field,
        value,
        daySchedule: newState[day],
      });
      return newState;
    });
  };

  if (isLoadingHours) {
    return <Text>Loading working hours...</Text>;
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
                placeholder="09:00"
                maxLength={5}
              />
              <Text> - </Text>
              <TextInput
                w={80}
                value={availableDays[item.day].to}
                onChange={(e) =>
                  handleTimeChange(item.day, "to", e.target.value)
                }
                placeholder="17:00"
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
              <Text c="dimmed">Unavailable</Text>
              <ActionIcon
                color="black"
                variant="subtle"
                radius={"sm"}
                onClick={() => handleToggleDay(item.day)}
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
