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
  Autocomplete,
} from "@mantine/core";
import { DatePickerInput, TimeInput } from "@mantine/dates";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useAllDoctorsWorkingHours } from "../hooks/useWorkingHoursQueries";
import { appointmentService } from "../services/appointmentService";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function EditAppointmentForm({ appointment, onSubmit, isLoading, onCancel }) {
  const { doctors } = useClinicQueries();
  const { doctorsWorkingDays } = useAllDoctorsWorkingHours();
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [isCheckingSlots, setIsCheckingSlots] = useState(false);

  // Extract initial values from appointment
  const getInitialValues = () => {
    if (!appointment)
      return {
        appointmentId: "",
        doctorId: "",
        appointmentDate: null,
        startTime: "",
        endTime: "",
        notes: "",
      };

    // Parse the start and end dates
    const startDate = appointment.startDate
      ? dayjs(appointment.startDate)
      : null;
    const endDate = appointment.endDate ? dayjs(appointment.endDate) : null;

    return {
      appointmentId: appointment.id,
      doctorId: appointment.doctor?.id?.toString() || "",
      appointmentDate: startDate ? startDate.toDate() : null,
      startTime: startDate ? startDate.format("h:mm A") : "",
      endTime: endDate ? endDate.format("h:mm A") : "",
      notes: appointment.notes || "",
    };
  };

  const form = useForm({
    initialValues: getInitialValues(),
    validate: {
      doctorId: (value) => (!value ? "Please select a doctor" : null),
      appointmentDate: (value) =>
        !value ? "Please select appointment date" : null,
      startTime: (value) => (!value ? "Please select start time" : null),
      endTime: (value) => (!value ? "Please select end time" : null),
    },
  });

  // Load available time slots when doctor or date changes
  useEffect(() => {
    const loadTimeSlots = async () => {
      if (form.values.doctorId && form.values.appointmentDate) {
        setIsCheckingSlots(true);

        try {
          const dateStr = dayjs(form.values.appointmentDate).format(
            "YYYY-MM-DD"
          );
          const startOfDay = dayjs.utc(`${dateStr} 00:00:00`).toISOString();
          const endOfDay = dayjs.utc(`${dateStr} 23:59:59`).toISOString();

          const response = await appointmentService.getAvailableSlots(
            parseInt(form.values.doctorId),
            {
              id: form.values.appointmentId, // Include appointment ID for update
              from: startOfDay,
              to: endOfDay,
            }
          );

          if (
            response.isSuccess &&
            response.result &&
            Array.isArray(response.result)
          ) {
            // Filter out the indicator slot that ends with "T23:30:00Z"
            const filteredSlots = response.result.filter((utcTime) => {
              return !utcTime.endsWith("T23:30:00Z");
            });

            const availableSlots = filteredSlots.map((utcTime) => {
              const localTime = dayjs(utcTime).tz(dayjs.tz.guess());
              return {
                value: utcTime,
                label: localTime.format("h:mm A"),
              };
            });

            setAvailableTimeSlots(availableSlots);
          } else {
            setAvailableTimeSlots([]);
          }
        } catch (error) {
          console.error("Error fetching available slots:", error);
          setAvailableTimeSlots([]);
        } finally {
          setIsCheckingSlots(false);
        }
      } else {
        setAvailableTimeSlots([]);
      }
    };

    loadTimeSlots();
  }, [
    form.values.doctorId,
    form.values.appointmentDate,
    form.values.appointmentId,
  ]);

  // Auto-calculate end time when start time changes
  useEffect(() => {
    if (form.values.startTime) {
      const selectedSlot = availableTimeSlots.find(
        (slot) => slot.label === form.values.startTime
      );

      if (selectedSlot) {
        const startTimeUTC = dayjs(selectedSlot.value);
        const endTimeUTC = startTimeUTC.add(30, "minute");
        const endTimeLocal = endTimeUTC.tz(dayjs.tz.guess());
        const endTimeDisplay = endTimeLocal.format("h:mm A");

        form.setFieldValue("endTime", endTimeDisplay);
      }
    }
  }, [form.values.startTime, availableTimeSlots]);

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

  const handleSubmit = (values) => {
    console.log("🔄 EDIT APPOINTMENT FORM SUBMISSION");
    console.log("📝 Form values received:", values);

    // Find the selected slot to get the UTC start time
    const selectedSlot = availableTimeSlots.find(
      (slot) => slot.label === values.startTime
    );

    if (!selectedSlot) {
      console.error("❌ Selected time slot not found in available slots");
      console.error("   Available slots:", availableTimeSlots);
      console.error("   Looking for:", values.startTime);
      return;
    }

    // Keep everything in UTC for calculation
    const startTimeUTC = dayjs.utc(selectedSlot.value); // Parse as UTC
    const endTimeUTC = startTimeUTC.add(30, "minute"); // Add 30 minutes in UTC

    console.log("🕐 TIME CALCULATION DEBUG:");
    console.log("   Selected slot value (UTC):", selectedSlot.value);
    console.log("   Start time UTC dayjs:", startTimeUTC.format());
    console.log("   End time UTC dayjs:", endTimeUTC.format());
    console.log("   Start date ISO string:", startTimeUTC.toISOString());
    console.log("   End date ISO string:", endTimeUTC.toISOString());

    const formattedValues = {
      id: values.appointmentId,
      newStartDate: startTimeUTC.toISOString(), // Changed from startDate
      newEndDate: endTimeUTC.toISOString(), // Changed from endDate
      notes: values.notes ? values.notes.trim() : "",
      doctorId: parseInt(values.doctorId),
    };

    console.log("🔍 PATIENT INFO DEBUG:");
    console.log("   appointment.userId:", appointment?.userId);
    console.log("   appointment.patientId:", appointment?.patientId);

    console.log("📤 REQUEST BODY for updateAppointment API:");
    console.log("   API Endpoint: PUT /Appointment/update");
    console.log("   Request Body:", JSON.stringify(formattedValues, null, 2));
    console.log("   Field Types:");
    console.log(
      "     - id:",
      typeof formattedValues.id,
      "->",
      formattedValues.id
    );
    console.log(
      "     - newStartDate:",
      typeof formattedValues.newStartDate,
      "->",
      formattedValues.newStartDate
    );
    console.log(
      "     - newEndDate:",
      typeof formattedValues.newEndDate,
      "->",
      formattedValues.newEndDate
    );
    console.log(
      "     - notes:",
      typeof formattedValues.notes,
      "->",
      formattedValues.notes
    );
    console.log(
      "     - doctorId:",
      typeof formattedValues.doctorId,
      "->",
      formattedValues.doctorId
    );

    onSubmit(formattedValues);
  };

  // Convert time slots to autocomplete data format
  const timeSlotOptions = availableTimeSlots.map((slot) => slot.label);

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack pos="relative">
        <LoadingOverlay visible={isLoading} />

        <TextInput
          radius="md"
          label="Appointment ID"
          value={appointment?.id || ""}
          disabled
        />

        <TextInput
          radius="md"
          label="Patient"
          value={appointment?.patientName || ""}
          disabled
        />

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
            placeholder="Select start time"
            required
            data={timeSlotOptions}
            // disabled={
            //   !form.values.doctorId ||
            //   !form.values.appointmentDate ||
            //   isCheckingSlots
            // }
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
          rows={3}
          {...form.getInputProps("notes")}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" loading={isLoading} radius="md">
            Update Appointment
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default EditAppointmentForm;
