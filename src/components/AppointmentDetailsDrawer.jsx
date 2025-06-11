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
  Avatar,
  Box,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import {
  IconCalendar,
  IconClock,
  IconUser,
  IconBuilding,
  IconNotes,
  IconEdit,
  IconTrash,
  IconPhone,
} from "@tabler/icons-react";

function AppointmentDetailsDrawer({
  opened,
  onClose,
  appointment,
  onEdit,
  onDelete,
}) {
  if (!appointment) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Cancelled":
        return "red";
      default:
        return "blue";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return "✓";
      case "Cancelled":
        return "×";
      default:
        return "•";
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title={"Appointment Details"}
      position="right"
      size="md"
      scrollAreaComponent={ScrollArea.Autosize}
    >
      <Stack gap="lg" p="md">
        {/* Patient Information Card */}
        <Stack gap="md">
          <Group gap="md">
            <Avatar size="md" radius="xl" color="blue">
              {appointment.patientName.charAt(0)}
            </Avatar>
            <Text size="lg" fw={600}>
              {appointment.patientName}
            </Text>
          </Group>
          <Group gap="xs" c="dimmed">
            <IconPhone size={16} />
            <Text size="sm">0585855858</Text>
          </Group>
          <Divider />

          {/* Appointment Details */}
          <Stack gap="xs">
            <Group gap="xs" c="dimmed">
              <IconCalendar size={16} />
              <Text size="sm" fw={500}>
                {appointment.displayDate || appointment.date}
              </Text>
            </Group>

            <Group gap="xs" c="dimmed">
              <IconClock size={16} />
              <Text size="sm" fw={500}>
                {appointment.time}
              </Text>
            </Group>

            <Group gap="xs" c="dimmed">
              <IconUser size={16} />
              <Text size="sm" fw={500}>
                Dr. {appointment.doctorName}
              </Text>
            </Group>

            <Group gap="xs" c="dimmed">
              <IconBuilding size={16} />
              <Text size="sm" fw={500}>
                {appointment.clinicName}
              </Text>
            </Group>
          </Stack>

          <Stack gap="xs">
            <Group gap="xs" c="dimmed">
              <IconNotes size={16} />
              <Text size="sm" fw={500}>
                Notes
              </Text>
            </Group>
            <Text size="sm" c="dimmed">
              {appointment.notes}
            </Text>
          </Stack>

          <Group justify="flex-end" mt="md">
            <Tooltip label="Edit Appointment">
              <ActionIcon
                radius="md"
                variant="subtle"
                color="black"
                size="lg"
                onClick={onEdit}
              >
                <IconEdit size={20} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Delete Appointment">
              <ActionIcon
                radius="md"
                variant="subtle"
                color="red"
                size="lg"
                onClick={onDelete}
              >
                <IconTrash size={20} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Stack>
    </Drawer>
  );
}

export default AppointmentDetailsDrawer;
