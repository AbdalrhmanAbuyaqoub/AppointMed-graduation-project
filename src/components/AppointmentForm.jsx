import { useForm } from "@mantine/form";
import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  LoadingOverlay,
  Text,
  Divider,
  SegmentedControl,
  Box,
  Autocomplete,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useUserQueries } from "../hooks/useUserQueries";
import { useAllDoctorsWorkingHours } from "../hooks/useWorkingHoursQueries";
import { appointmentService } from "../services/appointmentService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function AppointmentForm({
  onSubmit,
  isLoading,
  initialValues = null,
  resetTrigger = 0,
}) {
  const { doctors } = useClinicQueries();
  const { patients, isLoading: isLoadingPatients } = useUserQueries();
  const { doctorsWorkingDays } = useAllDoctorsWorkingHours();
  const [patientType, setPatientType] = useState("new");
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);

  const form = useForm({
    initialValues: initialValues || {
      doctorId: "",
      patientId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      appointmentDate: null,
      startTime: "",
      endTime: "",
      startTimeUTC: "",
      endTimeUTC: "",
      notes: "",
    },
    validate: {
      doctorId: (value) => (!value ? "Please select a doctor" : null),
      patientId: (value) =>
        patientType === "existing" && !value ? "Please select a patient" : null,
      firstName: (value) =>
        patientType === "new" && !value?.trim()
          ? "First name is required"
          : null,
      lastName: (value) =>
        patientType === "new" && !value?.trim()
          ? "Last name is required"
          : null,
      email: (value) => {
        if (patientType === "new") {
          if (!value?.trim()) return "Email is required";
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value) ? null : "Invalid email format";
        }
        return null;
      },
      phoneNumber: (value) =>
        patientType === "new" && !value?.trim()
          ? "Phone number is required"
          : null,
      address: (value) =>
        patientType === "new" && !value?.trim() ? "Address is required" : null,
      appointmentDate: (value) =>
        !value ? "Please select appointment date" : null,
      startTime: (value) => {
        if (!value) return "Please select appointment start time";
        return validateTimeFormat(value);
      },
      endTime: (value) =>
        !value ? "Please select appointment end time" : null,
    },
  });

  // Load available time slots when doctor or date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (form.values.doctorId && form.values.appointmentDate) {
        setIsCheckingSlots(true);
        form.setFieldValue("startTime", "");
        form.setFieldValue("endTime", "");
        form.setFieldValue("startTimeUTC", "");
        form.setFieldValue("endTimeUTC", "");

        // Get available slots directly from API
        try {
          const dateStr = dayjs(form.values.appointmentDate).format(
            "YYYY-MM-DD"
          );
          const startOfDay = dayjs.utc(`${dateStr} 00:00:00`).toISOString();
          const endOfDay = dayjs.utc(`${dateStr} 23:59:59`).toISOString();

          console.log("🔍 FETCHING AVAILABLE SLOTS:");
          console.log("  Doctor ID:", parseInt(form.values.doctorId));
          console.log("  Selected Date:", dateStr);
          console.log("  Date Range:", { from: startOfDay, to: endOfDay });

          const response = await appointmentService.getAvailableSlots(
            parseInt(form.values.doctorId),
            {
              from: startOfDay,
              to: endOfDay,
            }
          );

          console.log("📡 RAW API RESPONSE:");
          console.log("  Full Response:", JSON.stringify(response, null, 2));
          console.log("  Response Type:", typeof response);
          console.log("  Response Keys:", Object.keys(response || {}));
          console.log("  isSuccess:", response?.isSuccess);
          console.log("  result:", response?.result);
          console.log("  result type:", typeof response?.result);
          console.log(
            "  result length:",
            Array.isArray(response?.result)
              ? response.result.length
              : "not an array"
          );

          if (
            response.isSuccess &&
            response.result &&
            Array.isArray(response.result)
          ) {
            console.log("✅ PROCESSING AVAILABLE SLOTS:");
            console.log("  Raw UTC Times:", response.result);

            // Filter out the indicator slot that ends with "T23:30:00Z"
            const filteredSlots = response.result.filter((utcTime) => {
              return !utcTime.endsWith("T23:30:00Z");
            });

            console.log(
              "🔍 FILTERED SLOTS (removed indicator):",
              filteredSlots
            );

            const availableSlots = filteredSlots.map((utcTime, index) => {
              const localTime = dayjs(utcTime).tz(dayjs.tz.guess());
              const slot = {
                value: utcTime, // Keep the original UTC time as value
                label: localTime.format("h:mm A"), // Display in local time
                displayTime: localTime.format("HH:mm"), // For internal use
              };
              console.log(
                `  Slot ${index + 1}: ${utcTime} → ${
                  slot.label
                } (UTC: ${utcTime})`
              );
              return slot;
            });

            console.log("🎯 FINAL PROCESSED SLOTS:", availableSlots);
            setAvailableTimeSlots(availableSlots);
          } else {
            console.log("❌ NO AVAILABLE SLOTS:");
            console.log("  isSuccess:", response?.isSuccess);
            console.log("  result exists:", !!response?.result);
            console.log("  result is array:", Array.isArray(response?.result));
            console.log("  Setting empty slots array");
            setAvailableTimeSlots([]);
          }
        } catch (error) {
          console.error("🚨 ERROR FETCHING AVAILABLE SLOTS:");
          console.error("  Error Object:", error);
          console.error("  Error Message:", error.message);
          console.error("  Error Response:", error.response?.data);
          console.error("  Error Status:", error.response?.status);
          console.error("  Error Config:", error.config);
          setAvailableTimeSlots([]);
        } finally {
          setIsCheckingSlots(false);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    };

    loadTimeSlots();
  }, [form.values.doctorId, form.values.appointmentDate]);

  // Auto-set end time when start time changes
  useEffect(() => {
    if (form.values.startTime) {
      // Find the selected slot to get its UTC time
      const selectedSlot = availableTimeSlots.find(
        (slot) => slot.label === form.values.startTime
      );

      if (selectedSlot) {
        // Use the UTC time from the selected slot and add 30 minutes
        const startTimeUTC = dayjs(selectedSlot.value);
        const endTimeUTC = startTimeUTC.add(30, "minute");

        // Convert end time to local time for display
        const endTimeLocal = endTimeUTC.tz(dayjs.tz.guess());
        const endTimeDisplay = endTimeLocal.format("h:mm A");

        form.setFieldValue("endTime", endTimeDisplay);
        // Store the UTC end time for form submission
        form.setFieldValue("endTimeUTC", endTimeUTC.toISOString());
      }
    } else {
      form.setFieldValue("endTime", "");
      form.setFieldValue("endTimeUTC", "");
    }
  }, [form.values.startTime, availableTimeSlots]);

  // Clear fields when patient type changes
  useEffect(() => {
    if (patientType === "existing") {
      form.setValues({
        ...form.values,
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        patientId: "",
      });
    } else {
      form.setValues({
        ...form.values,
        patientId: "",
      });
    }
  }, [patientType]);

  // Reset form when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      console.log("🔄 RESETTING APPOINTMENT FORM");
      form.reset();
      setPatientType("new");
      setAvailableTimeSlots([]);
      setIsCheckingSlots(false);
    }
  }, [resetTrigger]);

  // Validate time format
  const validateTimeFormat = (value) => {
    if (!value) return null;

    const timeRegex24 = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    const timeRegex12 = /^(1[0-2]|0?[1-9]):[0-5][0-9]\s?(AM|PM)$/i;

    if (timeRegex24.test(value) || timeRegex12.test(value)) {
      return null;
    }

    return "Please enter time in HH:mm or h:mm AM/PM format";
  };

  // Helper function to check if a date should be excluded
  const isDateExcluded = (date) => {
    if (!form.values.doctorId || !doctorsWorkingDays) return false;

    const selectedDoctorId = parseInt(form.values.doctorId);
    const doctorWorkingDays = doctorsWorkingDays[selectedDoctorId] || [];

    if (doctorWorkingDays.length === 0) {
      return false;
    }

    const dayOfWeek = dayjs(date).day();
    return !doctorWorkingDays.includes(dayOfWeek);
  };

  const combineDateTime = (date, timeString) => {
    if (!date || !timeString) return null;

    const dateStr = dayjs(date).format("YYYY-MM-DD");
    let combinedDateTime;

    if (timeString.includes("AM") || timeString.includes("PM")) {
      combinedDateTime = dayjs(`${dateStr} ${timeString}`, "YYYY-MM-DD h:mm A");
    } else {
      combinedDateTime = dayjs(`${dateStr} ${timeString}`, "YYYY-MM-DD HH:mm");
    }

    if (!combinedDateTime.isValid()) {
      console.error("Invalid time format:", timeString);
      return null;
    }

    return combinedDateTime.toDate();
  };

  const convertToUTC = (date) => {
    if (!date) return null;
    const localDate = new Date(date);
    const isoString = localDate.toISOString();
    console.log("Converting date:", date, "to ISO:", isoString);
    return isoString;
  };

  const handleSubmit = (values) => {
    // Find the selected slot to get the UTC start time
    const selectedSlot = availableTimeSlots.find(
      (slot) => slot.label === values.startTime
    );

    if (!selectedSlot) {
      console.error("Selected time slot not found in available slots");
      return;
    }

    const startDateUTC = selectedSlot.value; // This is already in UTC
    const endDateUTC = values.endTimeUTC; // This was calculated and stored in UTC

    console.log("Form values before processing:", {
      appointmentDate: values.appointmentDate,
      startTime: values.startTime,
      endTime: values.endTime,
      startDateUTC,
      endDateUTC,
      patientType,
      values,
    });

    let formattedValues;

    if (patientType === "existing") {
      formattedValues = {
        startDate: startDateUTC,
        endDate: endDateUTC,
        notes: values.notes ? values.notes.trim() : "",
        doctorId: parseInt(values.doctorId),
        userId: values.patientId,
      };
    } else {
      formattedValues = {
        firstName: values.firstName.trim(),
        lastName: values.lastName.trim(),
        email: values.email.trim(),
        phoneNumber: values.phoneNumber.trim(),
        address: values.address.trim(),
        startDate: startDateUTC,
        endDate: endDateUTC,
        notes: values.notes ? values.notes.trim() : "",
        doctorId: parseInt(values.doctorId),
      };
    }

    formattedValues.patientType = patientType;

    console.log("Submitting appointment data:", formattedValues);
    onSubmit(formattedValues);
  };

  // Convert time slots to autocomplete data format
  const timeSlotOptions = availableTimeSlots.map((slot) => slot.label);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack pos="relative">
        <LoadingOverlay visible={isLoading} />

        <Select
          radius="md"
          label="Doctor"
          placeholder="Select a doctor"
          data={doctors.map((doctor) => ({
            value: doctor.id.toString(),
            label: `${doctor.name} (${doctor.clinicName})`,
          }))}
          searchable
          required
          {...form.getInputProps("doctorId")}
        />

        <Divider label="Patient Details" labelPosition="center" />

        <Box>
          <SegmentedControl
            radius="md"
            value={patientType}
            onChange={setPatientType}
            data={[
              { label: "New Patient", value: "new" },
              { label: "Existing Patient", value: "existing" },
            ]}
            fullWidth
          />
        </Box>

        {patientType === "existing" ? (
          <Select
            radius="md"
            label="Select Patient"
            placeholder="Choose an existing patient"
            data={patients.map((patient) => ({
              value: patient.id,
              label: patient.fullName + " - " + patient.email,
            }))}
            searchable
            required
            disabled={isLoadingPatients}
            {...form.getInputProps("patientId")}
          />
        ) : (
          <>
            <Group grow>
              <TextInput
                radius="md"
                label="First Name"
                placeholder="Enter patient first name"
                required
                {...form.getInputProps("firstName")}
              />

              <TextInput
                radius="md"
                label="Last Name"
                placeholder="Enter patient last name"
                required
                {...form.getInputProps("lastName")}
              />
            </Group>

            <TextInput
              radius="md"
              label="Email"
              placeholder="Enter patient email"
              type="email"
              required
              {...form.getInputProps("email")}
            />

            <TextInput
              radius="md"
              label="Phone Number"
              placeholder="Enter patient phone number"
              required
              {...form.getInputProps("phoneNumber")}
            />

            <TextInput
              radius="md"
              label="Address"
              placeholder="Enter patient address"
              required
              {...form.getInputProps("address")}
            />
          </>
        )}

        <Divider label="Appointment Details" labelPosition="center" />

        <DatePickerInput
          firstDayOfWeek={0}
          radius="md"
          label="Appointment Date"
          placeholder="Select appointment date"
          required
          clearable
          valueFormat="DD MMM YYYY"
          minDate={new Date()}
          excludeDate={isDateExcluded}
          weekendDays={[5]}
          {...form.getInputProps("appointmentDate")}
        />

        <Group grow>
          <Autocomplete
            radius="md"
            label="Start Time"
            placeholder="Type or select start time"
            required
            data={timeSlotOptions}
            disabled={
              !form.values.doctorId ||
              !form.values.appointmentDate ||
              isCheckingSlots
            }
            {...form.getInputProps("startTime")}
            limit={50}
          />

          <TextInput
            radius="md"
            label="End Time"
            placeholder="Auto-calculated"
            disabled
            value={form.values.endTime || ""}
          />
        </Group>

        {isCheckingSlots && (
          <Text size="sm" c="blue">
            Checking available time slots...
          </Text>
        )}

        {form.values.doctorId &&
          form.values.appointmentDate &&
          !isCheckingSlots &&
          availableTimeSlots.length === 0 && (
            <Text size="sm" c="red">
              No available time slots for the selected doctor on this date.
            </Text>
          )}

        <Textarea
          radius="md"
          label="Notes"
          placeholder="Add any notes about the appointment"
          {...form.getInputProps("notes")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isLoading} radius="md">
            {initialValues ? "Update Appointment" : "Create Appointment"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default AppointmentForm;
