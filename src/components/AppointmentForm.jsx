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
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useUserQueries } from "../hooks/useUserQueries";
import { useEffect, useState } from "react";

function AppointmentForm({ onSubmit, isLoading, initialValues = null }) {
  const { doctors } = useClinicQueries();
  const { patients, isLoading: isLoadingPatients } = useUserQueries();
  const [patientType, setPatientType] = useState("new"); // "new" or "existing"

  const form = useForm({
    initialValues: initialValues || {
      doctorId: "",
      patientId: "", // For existing patients
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
      startTime: (value) =>
        !value ? "Please select appointment start time" : null,
      endTime: (value) =>
        !value ? "Please select appointment end time" : null,
    },
  });

  useEffect(() => {
    if (form.values.startTime) {
      const endTime = new Date(form.values.startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      form.setFieldValue("endTime", endTime);
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
      patientType,
      values,
    });

    let formattedValues;

    if (patientType === "existing") {
      // For existing patient, use the createAppointment API
      formattedValues = {
        startDate: convertToUTC(values.startTime),
        endDate: convertToUTC(values.endTime),
        notes: values.notes ? values.notes.trim() : "",
        doctorId: parseInt(values.doctorId),
        userId: values.patientId,
      };
    } else {
      // For new patient, use the createAppointmentWithPatient API
      formattedValues = {
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
    }

    // Add patient type to the data so parent component knows which API to use
    formattedValues.patientType = patientType;

    // Debug log
    console.log("Submitting appointment data:", formattedValues);

    onSubmit(formattedValues);
  };

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
          {/* <Text size="sm" fw={500} mb="xs">
            Patient Type
          </Text> */}
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
              label: patient.username || `Patient ${patient.id}`,
            }))}
            searchable
            required
            disabled={isLoadingPatients}
            {...form.getInputProps("patientId")}
          />
        ) : (
          <>
            {/* <Divider label="Patient Information" labelPosition="center" /> */}

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

        <Group grow>
          <DateTimePicker
            radius="md"
            timePickerProps={{
              withDropdown: true,
              popoverProps: { withinPortal: false },
              format: "12h",
              withSeconds: false,
            }}
            label="Start Time"
            placeholder="Appointment start time"
            required
            clearable
            valueFormat="DD MMM YYYY hh:mm A"
            minDate={new Date()}
            {...form.getInputProps("startTime")}
          />

          <DateTimePicker
            radius="md"
            timePickerProps={{
              withDropdown: true,
              popoverProps: { withinPortal: false },
              format: "12h",
            }}
            label="End Time"
            placeholder="Appointment end time"
            required
            clearable
            valueFormat="DD MMM YYYY hh:mm A"
            minDate={form.values.startTime || new Date()}
            {...form.getInputProps("endTime")}
          />
        </Group>

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
