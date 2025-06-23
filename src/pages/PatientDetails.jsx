import { useParams, useNavigate } from "react-router-dom";
import { useUserQueries } from "../hooks/useUserQueries";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
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
} from "@tabler/icons-react";
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
  const { patients, isLoading: isPatientsLoading } = useUserQueries();
  const { getAppointmentsByUser } = useAppointmentQueries();

  // Find the specific patient
  const patient = patients.find((p) => p.id === id);

  // Get appointments for this patient
  const {
    data: appointments = [],
    isLoading: isAppointmentsLoading,
    error: appointmentsError,
  } = getAppointmentsByUser(id);

  const isLoading = isPatientsLoading || isAppointmentsLoading;

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
          <ActionIcon
            variant="subtle"
            onClick={() => navigate("/patients")}
            size="lg"
          >
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
        <ActionIcon
          variant="subtle"
          onClick={() => navigate("/patients")}
          size="lg"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>Patient Details</Title>
      </Group>

      {/* Patient Information */}
      <Paper radius="md" p="xl" withBorder maw={800} mb="xl">
        <Group gap="xl">
          <Avatar size={80} radius={80} variant="filled" color="#e7edf6">
            <Text fz="lg" fw={600}>
              {patient.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Text>
          </Avatar>

          <Stack gap="md" flex={1}>
            <Group justify="space-between">
              <Title order={3}>{patient.fullName}</Title>
              <Badge
                color={patient.isBanned ? "red" : "green"}
                variant="light"
                size="lg"
              >
                {patient.isBanned ? "Banned" : "Active"}
              </Badge>
            </Group>

            <Stack gap="sm">
              <Group>
                <IconMail size={18} stroke={1.5} color="gray" />
                <Text size="sm">{patient.email}</Text>
              </Group>
              <Group>
                <IconPhone size={18} stroke={1.5} color="gray" />
                <Text size="sm">{patient.phoneNumber || "N/A"}</Text>
              </Group>
              <Group>
                <IconMapPin size={18} stroke={1.5} color="gray" />
                <Text size="sm">
                  {patient.address || "No address provided"}
                </Text>
              </Group>
            </Stack>
          </Stack>
        </Group>
      </Paper>

      {/* Appointments Section */}
      <Paper radius="md" p="xl" withBorder>
        <Group justify="space-between" align="center" mb="md">
          <Title order={3}>Appointments</Title>
          <Group>
            <IconCalendar size={20} />
            <Text size="sm" c="dimmed">
              {appointments.length} appointment
              {appointments.length !== 1 ? "s" : ""}
            </Text>
          </Group>
        </Group>

        <Divider mb="md" />

        {appointmentsError ? (
          <Center py="xl">
            <Text c="red">
              Error loading appointments: {appointmentsError.message}
            </Text>
          </Center>
        ) : appointments.length === 0 ? (
          <Center py="xl">
            <Stack align="center" gap="md">
              <IconUser size={40} opacity={0.4} />
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
                <Table.Th c="dimmed">Date & Time</Table.Th>
                <Table.Th c="dimmed">Doctor</Table.Th>
                <Table.Th c="dimmed">Clinic</Table.Th>
                <Table.Th c="dimmed">Status</Table.Th>
                <Table.Th c="dimmed">Notes</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {appointments.map((appointment) => {
                const statusText = statusMap[appointment.status] || "Scheduled";
                const statusColor =
                  statusColorMap[appointment.status] || "blue";

                return (
                  <Table.Tr key={appointment.id}>
                    <Table.Td>
                      <Group gap="xs">
                        <IconClock size={16} opacity={0.6} />
                        <Stack gap="0">
                          <Text size="sm" fw={500}>
                            {new Date(appointment.startDate).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {new Date(appointment.startDate).toLocaleTimeString(
                              "en-US",
                              {
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                              }
                            )}{" "}
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
                        {appointment.clinicName || "N/A"}
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
      </Paper>
    </Container>
  );
}
