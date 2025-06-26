import {
  Table,
  Text,
  Badge,
  Group,
  Menu,
  ActionIcon,
  Box,
  Center,
  Modal,
  Button,
  Stack,
} from "@mantine/core";
import {
  IconUser,
  IconStethoscope,
  IconDotsVertical,
} from "@tabler/icons-react";
import { useState } from "react";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import AppointmentDetailsDrawer from "./AppointmentDetailsDrawer";
import EditAppointmentForm from "./EditAppointmentForm";
import { notifications } from "@mantine/notifications";

function TodaysAppointmentsTable({ appointments = [] }) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { updateAppointmentStatus, updateAppointment, deleteAppointment } =
    useAppointmentQueries();

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

  // Handle edit appointment
  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setIsEditModalOpen(true);
  };

  // Handle delete appointment
  const handleDelete = async (appointmentId) => {
    try {
      await deleteAppointment.mutateAsync(appointmentId);
      notifications.show({
        title: "Success",
        message: "Appointment deleted successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete appointment",
        color: "red",
      });
    }
  };

  // Handle update appointment
  const handleUpdate = async (values) => {
    try {
      await updateAppointment.mutateAsync({
        id: selectedAppointment.id,
        ...values,
      });
      notifications.show({
        title: "Success",
        message: "Appointment updated successfully",
        color: "green",
      });
      setIsEditModalOpen(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update appointment",
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

      {/* Edit Appointment Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={<Text fw={600}>Edit Appointment</Text>}
        size="lg"
        radius="md"
        centered
      >
        {selectedAppointment && (
          <EditAppointmentForm
            appointment={selectedAppointment}
            onSubmit={handleUpdate}
            isLoading={updateAppointment.isPending}
            onCancel={() => setIsEditModalOpen(false)}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Appointment"
        size="sm"
      >
        <Stack>
          <Text>
            Are you sure you want to delete this appointment for{" "}
            {selectedAppointment?.patientName}?
          </Text>
          <Group justify="flex-end" mt="md">
            <Button variant="light" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              color="red"
              loading={deleteAppointment.isPending}
              onClick={() => {
                handleDelete(selectedAppointment.id);
                setIsDeleteModalOpen(false);
              }}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* Appointment Details Drawer */}
      <AppointmentDetailsDrawer
        opened={isDetailsDrawerOpen}
        onClose={() => setIsDetailsDrawerOpen(false)}
        appointment={selectedAppointment}
        onEdit={() => {
          setIsDetailsDrawerOpen(false);
          setIsEditModalOpen(true);
        }}
        onDelete={() => {
          setIsDetailsDrawerOpen(false);
          setIsDeleteModalOpen(true);
        }}
      />
    </>
  );
}

export default TodaysAppointmentsTable;
