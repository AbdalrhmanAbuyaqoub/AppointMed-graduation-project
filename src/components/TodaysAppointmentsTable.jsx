import {
  Table,
  Text,
  Badge,
  Group,
  Menu,
  ActionIcon,
  Box,
  Center,
} from "@mantine/core";
import {
  IconUser,
  IconStethoscope,
  IconDotsVertical,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import AppointmentDetailsDrawer from "./AppointmentDetailsDrawer";
import { notifications } from "@mantine/notifications";

function TodaysAppointmentsTable({ appointments = [] }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const { updateAppointmentStatus } = useAppointmentQueries();

  // Status mapping
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

  // Handle status update (copied from AppointmentsTable)
  const handleStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const result = await updateAppointmentStatus.mutateAsync({
        appointmentId,
        newStatus,
      });

      notifications.show({
        title: "Success",
        message: result.message || "Appointment status updated successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update appointment status",
        color: "red",
      });
    }
  };

  // Handle row click to show appointment details (copied from AppointmentsTable)
  const handleRowClick = (appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsDrawerOpen(true);
  };

  if (appointments.length === 0) {
    return (
      <Center h={200}>
        <Text size="lg" fw={500} c="dimmed">
          No appointments scheduled for today
        </Text>
      </Center>
    );
  }

  return (
    <>
      <Table verticalSpacing="sm" highlightOnHover mt={15}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th c={"dimmed"}>ID</Table.Th>
            <Table.Th c={"dimmed"}>Patient</Table.Th>
            <Table.Th c={"dimmed"}>Doctor</Table.Th>
            <Table.Th c={"dimmed"}>Time</Table.Th>
            <Table.Th c={"dimmed"}>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {appointments.map((appointment) => {
            // Use only numeric status
            const currentStatus = appointment.status;
            const statusText = statusMap[currentStatus] || "Scheduled";
            const statusColor = statusColorMap[currentStatus] || "blue";

            return (
              <Table.Tr
                key={appointment.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(appointment)}
              >
                <Table.Td>{appointment.id}</Table.Td>
                <Table.Td>
                  <Text size="sm">{appointment.patientName}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">Dr. {appointment.doctorName}</Text>
                </Table.Td>
                <Table.Td>
                  <Text size="sm">{appointment.displayTime}</Text>
                </Table.Td>
                <Table.Td>
                  <Badge size="sm" color={statusColor}>
                    {statusText}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs" onClick={(e) => e.stopPropagation()}>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>

                      <Menu.Dropdown>
                        <Menu.Label>Update Status</Menu.Label>
                        <Menu.Item
                          onClick={() => handleStatusUpdate(appointment.id, 0)}
                          color="blue"
                        >
                          Mark as Scheduled
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => handleStatusUpdate(appointment.id, 1)}
                          color="red"
                        >
                          Mark as Cancelled
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => handleStatusUpdate(appointment.id, 2)}
                          color="green"
                        >
                          Mark as Completed
                        </Menu.Item>
                        <Menu.Item
                          onClick={() => handleStatusUpdate(appointment.id, 3)}
                          color="orange"
                        >
                          Mark as No Show
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>

      {/* Appointment Details Drawer */}
      <AppointmentDetailsDrawer
        opened={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        appointment={selectedAppointment}
      />
    </>
  );
}

export default TodaysAppointmentsTable;
