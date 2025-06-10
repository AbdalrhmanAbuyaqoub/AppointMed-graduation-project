import {
  Container,
  Title,
  Paper,
  Stack,
  Select,
  Group,
  Button,
} from "@mantine/core";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import { useState, useCallback } from "react";
import { useDisclosure } from "@mantine/hooks";
import AppointmentsTable from "../components/AppointmentsTable";
import CreateAppointmentDrawer from "../components/CreateAppointmentDrawer";
import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
dayjs.extend(utc);
dayjs.extend(timezone);

function Appointments() {
  const [selectedClinicId, setSelectedClinicId] = useState(null);
  const [selectedDoctorId, setSelectedDoctorId] = useState(null);
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const {
    clinics,
    doctors,
    isLoading: isLoadingClinics,
    error: clinicsError,
  } = useClinicQueries();

  const {
    appointments,
    isLoadingAppointments,
    appointmentsError,
    getAppointmentsByClinic,
    getAppointmentsByDoctor,
  } = useAppointmentQueries();

  // Get filtered appointments based on selection
  const { data: clinicAppointments } =
    getAppointmentsByClinic(selectedClinicId);
  const { data: doctorAppointments } =
    getAppointmentsByDoctor(selectedDoctorId);

  // Determine which appointments to display based on selection
  const displayedAppointments = selectedDoctorId
    ? doctorAppointments
    : selectedClinicId
    ? clinicAppointments
    : appointments;

  const handleSelect = useCallback((value) => {
    if (!value || value === "all") {
      setSelectedClinicId(null);
      setSelectedDoctorId(null);
    } else if (value.startsWith("clinic-")) {
      const clinicId = value.replace("clinic-", "");
      setSelectedClinicId(clinicId);
      setSelectedDoctorId(null); // Reset doctor selection when clinic is selected
    } else if (value.startsWith("doctor-")) {
      const doctorId = value.replace("doctor-", "");
      setSelectedDoctorId(doctorId);
      setSelectedClinicId(null); // Reset clinic selection when doctor is selected
    }
  }, []);

  const selectData = [
    {
      group: "General",
      items: [
        {
          value: "all",
          label: "All Appointments",
        },
      ],
    },
    {
      group: "Clinics",
      items: clinics.map((clinic) => ({
        value: `clinic-${clinic.id}`,
        label: clinic.name,
      })),
    },
    {
      group: "Doctors",
      items: doctors.map((doctor) => ({
        value: `doctor-${doctor.id}`,
        label: `${doctor.name} (${doctor.clinicName})`,
      })),
    },
  ];

  // Transform appointments data to match the table's expected format
  const formattedAppointments = (displayedAppointments || []).map(
    (appointment) => {
      try {
        const startDate = appointment.startDate
          ? dayjs.utc(appointment.startDate).tz(dayjs.tz.guess())
          : null;

        // Validate if the date is valid
        if (!startDate || !startDate.isValid()) {
          return {
            ...appointment,
            id: appointment.id,
            patientName: appointment.patientName,
            doctorName: appointment.doctor?.name || "N/A",
            clinicName: appointment.doctor?.clinicName || "N/A",
            date: "Invalid Date",
            time: "Invalid Time",
            status: appointment.status || "Scheduled",
            doctor: appointment.doctor,
          };
        }

        // Format date as YYYY-MM-DD for consistent comparison
        const dateStr = startDate.format("YYYY-MM-DD");

        return {
          id: appointment.id,
          patientName: appointment.patientName,
          doctorName: appointment.doctor?.name || "N/A",
          clinicName: appointment.doctor?.clinicName || "N/A",
          // Store the raw date for filtering
          rawDate: startDate.toDate(),
          // Format date for display
          date: dateStr,
          displayDate: startDate.format("MMM D, YYYY"),
          time: startDate.format("hh:mm A"),
          status: appointment.status || "Scheduled",
          doctor: appointment.doctor,
          patientPhone: appointment.patientPhone,
          notes: appointment.notes,
        };
      } catch (error) {
        console.error("Error formatting appointment:", error);
        return {
          ...appointment,
          id: appointment.id,
          patientName: appointment.patientName,
          doctorName: appointment.doctor?.name || "N/A",
          clinicName: appointment.doctor?.clinicName || "N/A",
          date: "Error",
          displayDate: "Error",
          time: "Error",
          status: appointment.status || "Scheduled",
          doctor: appointment.doctor,
        };
      }
    }
  );

  return (
    <Container pt={20} fluid maw={1232}>
      <Stack>
        <Title order={2}>Appointments</Title>

        <Group mt={60} justify="space-between">
          <Select
            w={200}
            size="lg"
            radius="md"
            data={selectData}
            placeholder="Select clinic or doctor"
            disabled={isLoadingClinics}
            error={clinicsError?.message}
            onChange={handleSelect}
            value={
              selectedDoctorId
                ? `doctor-${selectedDoctorId}`
                : selectedClinicId
                ? `clinic-${selectedClinicId}`
                : "all"
            }
            comboboxProps={{ width: 500, position: "bottom-start" }}
            styles={{
              dropdown: {
                borderRadius: "var(--mantine-radius-md)",
                boxShadow: "var(--mantine-shadow-md)",
                minWidth: "200px",
              },
            }}
          />

          <Button
            onClick={openDrawer}
            leftSection={<IconPlus size={16} />}
            variant="outline"
            size="lg"
            radius="xl"
          >
            New Appointment
          </Button>
        </Group>

        <Paper withBorder radius="md" p="md" shadow="xs">
          {isLoadingAppointments ? (
            <div>Loading appointments...</div>
          ) : appointmentsError ? (
            <div>Error loading appointments: {appointmentsError.message}</div>
          ) : (
            <AppointmentsTable appointments={formattedAppointments} />
          )}
        </Paper>

        <CreateAppointmentDrawer opened={drawerOpened} onClose={closeDrawer} />
      </Stack>
    </Container>
  );
}

export default Appointments;
