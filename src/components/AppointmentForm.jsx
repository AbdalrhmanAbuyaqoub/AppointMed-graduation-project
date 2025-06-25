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

function AppointmentForm({ onSubmit, isLoading, initialValues = null }) {
  const { doctors } = useClinicQueries();
  const { patients, isLoading: isLoadingPatients } = useUserQueries();
  const { doctorsWorkingDays, isLoading: isLoadingWorkingHours } =
    useAllDoctorsWorkingHours();
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

  // Generate time slots from doctor working hours
  const generateTimeSlotsFromWorkingHours = async (doctorId, selectedDate) => {
    if (!doctorId || !selectedDate) return [];

    try {
      setIsCheckingSlots(true);

      const allDoctorsWorkingHours =
        await appointmentService.getAllDoctorsWorkingHours();
      const doctorWorkingHours = allDoctorsWorkingHours.find(
        (doctor) => doctor.doctorId === parseInt(doctorId)
      );

      console.log("Doctor working hours:", doctorWorkingHours);

      if (!doctorWorkingHours || !doctorWorkingHours.workingHours) {
        console.log("No working hours found, using default slots");
        return generateDefaultTimeSlots();
      }

      const dayOfWeek = dayjs(selectedDate).day();
      const workingDay = doctorWorkingHours.workingHours.find(
        (day) => day.dayOfWeek === dayOfWeek
      );

      console.log("Working day data:", workingDay);

      if (
        !workingDay ||
        workingDay.startTime === "00:00:00" ||
        workingDay.endTime === "00:00:00"
      ) {
        console.log("Doctor doesn't work on this day");
        return [];
      }

      const selectedDateStr = dayjs(selectedDate).format("YYYY-MM-DD");
      const startTime = dayjs
        .utc(`${selectedDateStr} ${workingDay.startTime}`)
        .tz(dayjs.tz.guess());
      const endTime = dayjs
        .utc(`${selectedDateStr} ${workingDay.endTime}`)
        .tz(dayjs.tz.guess());

      console.log(
        "Working hours:",
        startTime.format("h:mm A"),
        "to",
        endTime.format("h:mm A")
      );

      const slots = [];
      let currentTime = startTime;

      while (currentTime.isBefore(endTime)) {
        const timeString = currentTime.format("HH:mm");
        const displayTime = currentTime.format("h:mm A");

        slots.push({
          value: timeString,
          label: displayTime,
        });

        currentTime = currentTime.add(30, "minute");
      }

      console.log("Generated", slots.length, "time slots");
      return slots;
    } catch (error) {
      console.error("Error generating time slots:", error);
      return generateDefaultTimeSlots();
    } finally {
      setIsCheckingSlots(false);
    }
  };

  // Default time slots (9 AM to 5 PM, 30-minute intervals)
  const generateDefaultTimeSlots = () => {
    console.log("Generating default time slots");
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        const displayTime = dayjs(`2000-01-01 ${timeString}`).format("h:mm A");

        slots.push({
          value: timeString,
          label: displayTime,
        });
      }
    }
    return slots;
  };

  // Check available slots for the entire day using the API
  const getAvailableSlotsForDay = async (doctorId, selectedDate) => {
    try {
      const dateStr = dayjs(selectedDate).format("YYYY-MM-DD");
      const startOfDay = dayjs(`${dateStr} 00:00:00`).toISOString();
      const endOfDay = dayjs(`${dateStr} 23:59:59`).toISOString();

      const response = await appointmentService.getAvailableSlots(
        parseInt(doctorId),
        {
          from: startOfDay,
          to: endOfDay,
        }
      );

      console.log("API response for available slots:", response);

      if (
        response.isSuccess &&
        response.result &&
        Array.isArray(response.result)
      ) {
        const availableSlots = response.result.map((utcTime) => {
          const localTime = dayjs(utcTime).tz(dayjs.tz.guess());
          return localTime.format("HH:mm");
        });

        console.log("Available time slots from API:", availableSlots);
        return availableSlots;
      }

      console.log("No available slots returned from API");
      return [];
    } catch (error) {
      console.error("Error getting available slots:", error);
      return "all-available";
    }
  };

  // Filter time slots based on API availability
  const filterAvailableSlots = async (timeSlots, doctorId, selectedDate) => {
    if (!timeSlots.length || !doctorId || !selectedDate) {
      console.log("No slots to filter or missing parameters");
      return [];
    }

    console.log("Checking availability for", timeSlots.length, "time slots");

    const apiAvailableSlots = await getAvailableSlotsForDay(
      doctorId,
      selectedDate
    );

    const availableSlots = timeSlots.filter((slot) => {
      return apiAvailableSlots.includes(slot.value);
    });

    console.log("Filtered available slots:", availableSlots);
    return availableSlots;
  };

  // Load available time slots when doctor or date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (form.values.doctorId && form.values.appointmentDate) {
        setIsCheckingSlots(true);
        form.setFieldValue("startTime", "");
        form.setFieldValue("endTime", "");

        const allSlots = await generateTimeSlotsFromWorkingHours(
          form.values.doctorId,
          form.values.appointmentDate
        );

        const available = await filterAvailableSlots(
          allSlots,
          form.values.doctorId,
          form.values.appointmentDate
        );

        setAvailableTimeSlots(available);
        setIsCheckingSlots(false);
      } else {
        setAvailableTimeSlots([]);
      }
    };

    loadTimeSlots();
  }, [form.values.doctorId, form.values.appointmentDate]);

  // Auto-set end time when start time changes
  useEffect(() => {
    if (form.values.startTime) {
      let parsedTime;

      if (
        form.values.startTime.includes("AM") ||
        form.values.startTime.includes("PM")
      ) {
        parsedTime = dayjs(
          `2000-01-01 ${form.values.startTime}`,
          "YYYY-MM-DD h:mm A"
        );
      } else {
        parsedTime = dayjs(
          `2000-01-01 ${form.values.startTime}`,
          "YYYY-MM-DD HH:mm"
        );
      }

      if (parsedTime.isValid()) {
        const endTime = parsedTime.add(30, "minute");
        const endTimeString = endTime.format("HH:mm");
        form.setFieldValue("endTime", endTimeString);
      }
    } else {
      form.setFieldValue("endTime", "");
    }
  }, [form.values.startTime]);

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
    const startDateTime = combineDateTime(
      values.appointmentDate,
      values.startTime
    );
    const endDateTime = combineDateTime(values.appointmentDate, values.endTime);

    console.log("Form values before processing:", {
      appointmentDate: values.appointmentDate,
      startTime: values.startTime,
      endTime: values.endTime,
      startDateTime,
      endDateTime,
      patientType,
      values,
    });

    let formattedValues;

    if (patientType === "existing") {
      formattedValues = {
        startDate: convertToUTC(startDateTime),
        endDate: convertToUTC(endDateTime),
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
        startDate: convertToUTC(startDateTime),
        endDate: convertToUTC(endDateTime),
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
            placeholder="Type or select start time (e.g., 2:30 PM or 14:30)"
            required
            data={timeSlotOptions}
            disabled={
              !form.values.doctorId ||
              !form.values.appointmentDate ||
              isCheckingSlots
            }
            {...form.getInputProps("startTime")}
            limit={10}
          />

          <TextInput
            radius="md"
            label="End Time"
            placeholder="Auto-calculated"
            disabled
            value={
              form.values.endTime
                ? dayjs(`2000-01-01 ${form.values.endTime}`).format("h:mm A")
                : ""
            }
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
