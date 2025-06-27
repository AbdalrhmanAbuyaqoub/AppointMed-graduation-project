import { useParams, useNavigate } from "react-router-dom";
import { useUserQueries } from "../hooks/useUserQueries";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import { useClinicQueries } from "../hooks/useClinicQueries";
import {
  Badge,
  Group,
  Stack,
  Text,
  Container,
  Avatar,
  Title,
  Button,
  ActionIcon,
  Paper,
  Table,
  Center,
  LoadingOverlay,
  Divider,
  SimpleGrid,
  useMantineTheme,
  Space,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconMail,
  IconPhone,
  IconMapPin,
  IconCalendar,
  IconUser,
  IconClock,
  IconUserCheck,
  IconTrash,
} from "@tabler/icons-react";
import { getUserInitials } from "../utils/userUtils";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import { useState } from "react";
// Using native JavaScript Date methods for formatting

const statusMap = {
  0: "Scheduled",
  1: "Cancelled",
  2: "Completed",
  3: "No Show",
};

const statusColorMap = {
  0: "blue",
  1: "red",
  2: "green",
  3: "orange",
};

export default function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    patients,
    isLoading: isPatientsLoading,
    deleteAccount,
    isDeletingAccount,
  } = useUserQueries();
  const { getAppointmentsByUser } = useAppointmentQueries();
  const { clinics, doctors } = useClinicQueries();

  // Find the specific patient
  const patient = patients.find((p) => p.id === id);

  // Get appointments for this patient
  const {
    data: appointments = [],
    isLoading: isAppointmentsLoading,
    error: appointmentsError,
  } = getAppointmentsByUser(id);

  // Helper function to get clinic name from various sources
  const getClinicName = (appointment) => {
    // Then try to get clinic name from doctor information in the appointment
    if (appointment.doctor?.clinicName) {
      return appointment.doctor.clinicName;
    }

    // Try to find doctor in the global doctors list and get clinic name
    if (appointment.doctor?.id) {
      const doctorId = appointment.doctor.id;
      const doctor = doctors.find((d) => d.id === doctorId);
      if (doctor?.clinicName) {
        return doctor.clinicName;
      }
    }

    return "N/A";
  };

  const isLoading = isPatientsLoading || isAppointmentsLoading;

  const handleDeletePatient = () => {
    if (patient) {
      deleteAccount({
        email: patient.email,
        id: patient.id,
      });
      setIsDeleteModalOpen(false);
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <Container pt={20} maw={1232} fluid>
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (!patient) {
    return (
      <Container pt={20} maw={1232} fluid>
        <Group mb="xl">
          <ActionIcon variant="subtle" onClick={() => navigate(-1)} size="lg">
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={2}>Patient Not Found</Title>
        </Group>
        <Paper radius="md" p="xl" withBorder>
          <Center>
            <Text c="dimmed">The requested patient could not be found.</Text>
          </Center>
        </Paper>
      </Container>
    );
  }

  return (
    <Container pt={20} maw={1232} fluid>
      <Group mb="xl">
        <ActionIcon variant="subtle" onClick={() => navigate(-1)} size="lg">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>Patient Details</Title>
      </Group>

      {/* Profile Information Card */}
      <Paper p="xl" radius="md" withBorder maw={1232}>
        <Stack gap="xl">
          {/* Header with Avatar and Name */}
          <Group gap="xl" align="flex-start">
            <Avatar size="xl" radius="50%" variant="filled" color="gray.3">
              <Text fz={30}>
                {getUserInitials({ fullName: patient.fullName })}
              </Text>
            </Avatar>

            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={2} fz={28}>
                {patient.fullName}
              </Title>
              <Group gap="md">
                <Badge size="lg" variant="filled" color="blue">
                  PATIENT
                </Badge>
                <Badge
                  variant="filled"
                  size="lg"
                  color={patient.isBanned ? "red" : "green"}
                >
                  {patient.isBanned ? "BANNED" : "ACTIVE"}
                </Badge>
              </Group>
            </Stack>

            <Button
              variant="outline"
              color="red"
              leftSection={<IconTrash size={16} />}
              onClick={() => setIsDeleteModalOpen(true)}
              radius="md"
              size="sm"
            >
              Delete Patient
            </Button>
          </Group>

          <Divider />

          {/* Patient Details Grid */}
          <Group cols={{ base: 1, sm: 2 }} gap="xl">
            {/* Basic Information */}
            <Stack gap="md">
              <Title order={3} size="h4">
                Basic Information
              </Title>
              <Group gap="md">
                <IconUser size={20} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={500}>
                  Full Name:
                </Text>
                <Text size="sm">{patient.fullName}</Text>
              </Group>
              <Group gap="md">
                <IconMail size={20} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={500}>
                  Email:
                </Text>
                <Text size="sm">{patient.email}</Text>
              </Group>
              <Group gap="md">
                <IconUserCheck size={20} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={500}>
                  Status:
                </Text>
                <Text size="sm">{patient.isBanned ? "Banned" : "Active"}</Text>
              </Group>
            </Stack>

            {/* Contact Information */}
            <Stack gap="md">
              <Title order={3} size="h4">
                Contact Information
              </Title>
              <Group gap="md">
                <IconPhone size={20} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={500}>
                  Phone:
                </Text>
                <Text size="sm">{patient.phoneNumber || "Not provided"}</Text>
              </Group>
              <Group gap="md">
                <IconMapPin size={20} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={500}>
                  Address:
                </Text>
                <Text size="sm">{patient.address || "Not provided"}</Text>
              </Group>
            </Stack>
          </Group>
        </Stack>
      </Paper>
      {/* <Space h="xl" /> */}

      {/* Appointments Section */}
      <Paper p="xl" mt="xl" radius="md" withBorder maw={1232}>
        {/* <Space h="xl" /> */}
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={3}>Appointment History</Title>
            <Group gap="xs">
              <IconCalendar size={20} color="var(--mantine-color-gray-6)" />
              <Text size="sm" c="dimmed">
                {appointments.length} appointment
                {appointments.length !== 1 ? "s" : ""}
              </Text>
            </Group>
          </Group>

          {appointmentsError ? (
            <Center py="xl">
              <Text c="red">
                Error loading appointments: {appointmentsError.message}
              </Text>
            </Center>
          ) : appointments.length === 0 ? (
            <Center py="xl">
              <Stack align="center" gap="md">
                <IconCalendar size={48} opacity={0.4} />
                <Text size="lg" c="dimmed">
                  No appointments found
                </Text>
                <Text size="sm" c="dimmed">
                  This patient has no scheduled appointments.
                </Text>
              </Stack>
            </Center>
          ) : (
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th c="dimmed">ID</Table.Th>
                  <Table.Th c="dimmed">Date & Time</Table.Th>
                  <Table.Th c="dimmed">Doctor</Table.Th>
                  <Table.Th c="dimmed">Clinic</Table.Th>
                  <Table.Th c="dimmed">Status</Table.Th>
                  <Table.Th c="dimmed">Notes</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {appointments.map((appointment) => {
                  const statusText =
                    statusMap[appointment.status] || "Scheduled";
                  const statusColor =
                    statusColorMap[appointment.status] || "blue";

                  return (
                    <Table.Tr key={appointment.id}>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {appointment.id}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <IconClock size={16} opacity={0.6} />
                          <Stack gap="0">
                            <Text size="sm" fw={500}>
                              {new Date(
                                appointment.startDate
                              ).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Text>
                            <Text size="xs" c="dimmed">
                              {new Date(
                                appointment.startDate
                              ).toLocaleTimeString("en-US", {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              })}{" "}
                              -{" "}
                              {new Date(appointment.endDate).toLocaleTimeString(
                                "en-US",
                                {
                                  hour: "numeric",
                                  minute: "2-digit",
                                  hour12: true,
                                }
                              )}
                            </Text>
                          </Stack>
                        </Group>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" fw={500}>
                          {appointment.doctor?.name || "N/A"}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {getClinicName(appointment)}
                        </Text>
                      </Table.Td>
                      <Table.Td>
                        <Badge color={statusColor} variant="light" size="sm">
                          {statusText}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Text size="sm" c="dimmed">
                          {appointment.notes || "No notes"}
                        </Text>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      </Paper>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePatient}
        title="Delete Patient"
        itemName={patient?.fullName || "this patient"}
        isLoading={isDeletingAccount}
        additionalMessage="This will permanently delete the patient and all associated data."
      />
    </Container>
  );
}
