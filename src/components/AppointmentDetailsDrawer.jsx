import {
  Drawer,
  Stack,
  Paper,
  Group,
  Title,
  Badge,
  Divider,
  Text,
  Button,
  ScrollArea,
  Flex,
  Avatar,
  Box,
  ActionIcon,
  Container,
  Tooltip,
  Card,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconChevronRight,
  IconBuilding,
  IconNote,
  IconEdit,
  IconTrash,
  IconPhone,
  IconHash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import { getUserInitials } from "../utils/userUtils";

function AppointmentDetailsDrawer({
  opened,
  onClose,
  appointment,
  onEdit,
  onDelete,
}) {
  const navigate = useNavigate();

  if (!appointment) return null;

  const currentStatus = appointment.status;

  const statusMap = {
    0: "Scheduled",
    1: "Cancelled",
    2: "Completed",
    3: "No Show",
  };

  // Status color mapping
  const statusColorMap = {
    0: "blue",
    1: "red",
    2: "green",
    3: "orange",
  };

  return (
    <Drawer
      offset={25}
      radius="md"
      shadow="xl"
      overlayProps={{ opacity: 0.2 }}
      opened={opened}
      onClose={onClose}
      styles={{
        header: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--mantine-color-gray-3)",
        },
        title: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexGrow: 1,
        },
      }}
      title={
        <>
          <Badge size="md" p="sm" color={statusColorMap[currentStatus]}>
            {statusMap[currentStatus]}
          </Badge>
          <Group gap={0} justify="end">
            <ActionIcon
              radius="md"
              variant="subtle"
              size="lg"
              onClick={onEdit}
              color="dimmed"
            >
              <IconEdit size={20} />
            </ActionIcon>
            <ActionIcon
              radius="md"
              variant="subtle"
              size="lg"
              onClick={onDelete}
              color="dimmed"
            >
              <IconTrash size={20} />
            </ActionIcon>
          </Group>
        </>
      }
      position="right"
      size="md"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="xs" mt="md">
        {/* Patient Information Card */}
        <Group
          justify="space-between"
          gap="md"
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (appointment.patientId) {
              navigate(`/patients/${appointment.patientId}`);
            } else {
              console.error("No patient ID available for navigation");
            }
          }}
        >
          <Group>
            <Avatar
              color="#e7edf6"
              style={{ cursor: "pointer" }}
              onClick={() => {
                if (appointment.patientId) {
                  navigate(`/patients/${appointment.patientId}`);
                } else {
                  console.error("No patient ID available for navigation");
                }
              }}
              size="md"
              radius="xl"
              variant="filled"
            >
              <Text fz="sm">
                {getUserInitials({ fullName: appointment.patientName })}
              </Text>
            </Avatar>
            <Stack gap="0" c="dimmed">
              <Text size="lg" fw={700}>
                {appointment.patientName}
              </Text>
              <Group gap="4" c="dimmed">
                <IconPhone size={16} />
                <Text size="sm" c="dimmed">
                  00000fixMe000
                  {/* TODO: Add phone number */}
                </Text>
              </Group>
            </Stack>
          </Group>

          <IconChevronRight stroke={1.5} size={24} />
        </Group>
        <Divider my="8" />

        {/* Appointment Details */}
        <Stack>
          <Group gap="xs" c="dimmed" align="start">
            <IconCalendar size={24} color="black" />
            <Stack gap="0">
              <Text fw={500}>{appointment.time}</Text>
              <Text fw={500} c="dimmed">
                {appointment.displayDate || appointment.date}
              </Text>
            </Stack>
          </Group>

          <Group gap="xs" c="dimmed" align="start">
            <IconBuilding size={24} color="black" />
            <Stack gap="0">
              <Text fw={500}>{appointment.clinicName}</Text>
              <Text fw={500} c="dimmed">
                Dr. {appointment.doctorName}
              </Text>
            </Stack>
          </Group>

          <Group align="start" gap="xs" c="dimmed">
            <IconNote size={24} color="black" />
            <Stack gap="0">
              <Text fw={500}>Notes</Text>
              <Text fw={500} c="dimmed">
                {appointment.notes}
              </Text>
            </Stack>
          </Group>
        </Stack>

        <Group justify="flex-end" mt="md"></Group>
      </Stack>
    </Drawer>
  );
}

export default AppointmentDetailsDrawer;
