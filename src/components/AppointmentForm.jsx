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
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useClinicQueries } from "../hooks/useClinicQueries";

function AppointmentForm({ onSubmit, isLoading, initialValues = null }) {
  const { doctors } = useClinicQueries();

  const form = useForm({
    initialValues: initialValues || {
      doctorId: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      startTime: null,
      endTime: null,
      notes: "",
    },
    validate: {
      doctorId: (value) => (!value ? "Please select a doctor" : null),
      firstName: (value) => (!value.trim() ? "First name is required" : null),
      lastName: (value) => (!value.trim() ? "Last name is required" : null),
      email: (value) => {
        if (!value.trim()) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? null : "Invalid email format";
      },
      phoneNumber: (value) =>
        !value.trim() ? "Phone number is required" : null,
      address: (value) => (!value.trim() ? "Address is required" : null),
      startTime: (value) =>
        !value ? "Please select appointment start time" : null,
      endTime: (value) =>
        !value ? "Please select appointment end time" : null,
    },
  });

  const convertToUTC = (date) => {
    if (!date) return null;
    const localDate = new Date(date);
    // Format: YYYY-MM-DDTHH:mm:ss.sssZ
    const isoString = localDate.toISOString();
    console.log("Converting date:", date, "to ISO:", isoString);
    return isoString;
  };

  const handleSubmit = (values) => {
    // Debug the form values before processing
    console.log("Form values before processing:", {
      startTime: values.startTime,
      endTime: values.endTime,
      startTimeType: typeof values.startTime,
      endTimeType: typeof values.endTime,
    });

    // Format data according to the new API structure
    const formattedValues = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phoneNumber: values.phoneNumber.trim(),
      address: values.address.trim(),
      startDate: convertToUTC(values.startTime),
      endDate: convertToUTC(values.endTime),
      notes: values.notes ? values.notes.trim() : "",
      doctorId: parseInt(values.doctorId),
    };

    // Debug log
    console.log("Submitting appointment data:", formattedValues);

    onSubmit(formattedValues);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack pos="relative">
        <LoadingOverlay visible={isLoading} />

        <Select
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

        <Divider label="Patient Information" labelPosition="center" />

        <Group grow>
          <TextInput
            label="First Name"
            placeholder="Enter patient first name"
            required
            {...form.getInputProps("firstName")}
          />

          <TextInput
            label="Last Name"
            placeholder="Enter patient last name"
            required
            {...form.getInputProps("lastName")}
          />
        </Group>

        <TextInput
          label="Email"
          placeholder="Enter patient email"
          type="email"
          required
          {...form.getInputProps("email")}
        />

        <TextInput
          label="Phone Number"
          placeholder="Enter patient phone number"
          required
          {...form.getInputProps("phoneNumber")}
        />

        <TextInput
          label="Address"
          placeholder="Enter patient address"
          required
          {...form.getInputProps("address")}
        />

        <Divider label="Appointment Details" labelPosition="center" />

        <Group grow>
          <DateTimePicker
            timePickerProps={{
              withDropdown: true,
              popoverProps: { withinPortal: false },
              format: "12h",
              withSeconds: false,
            }}
            label="Start Time"
            placeholder="Select appointment start time"
            required
            clearable
            valueFormat="DD MMM YYYY hh:mm A"
            minDate={new Date()}
            {...form.getInputProps("startTime")}
          />

          <DateTimePicker
            timePickerProps={{
              withDropdown: true,
              popoverProps: { withinPortal: false },
              format: "12h",
            }}
            label="End Time"
            placeholder="Select appointment end time"
            required
            clearable
            valueFormat="DD MMM YYYY hh:mm A"
            minDate={form.values.startTime || new Date()}
            {...form.getInputProps("endTime")}
          />
        </Group>

        <Textarea
          label="Notes"
          placeholder="Add any notes about the appointment"
          {...form.getInputProps("notes")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" loading={isLoading}>
            {initialValues ? "Update Appointment" : "Create Appointment"}
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export default AppointmentForm;
