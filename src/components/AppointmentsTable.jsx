import {
  Table,
  Text,
  Button,
  Group,
  Badge,
  Menu,
  Stack,
  Center,
  ActionIcon,
  SegmentedControl,
  Modal,
} from "@mantine/core";
import { IconEdit, IconTrash, IconCaretDownFilled } from "@tabler/icons-react";
import { DatePicker } from "@mantine/dates";
import { useState } from "react";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import { notifications } from "@mantine/notifications";
import AppointmentForm from "./AppointmentForm";

// Helper function to get date ranges
const getDateRange = (range) => {
  const today = new Date();
  const startOfDay = new Date(today.setHours(0, 0, 0, 0));

  switch (range) {
    case "today":
      return [startOfDay, new Date(today.setHours(23, 59, 59, 999))];
    case "this-week": {
      const start = new Date(startOfDay);
      start.setDate(start.getDate() - start.getDay()); // Start of week (Sunday)
      const end = new Date(start);
      end.setDate(end.getDate() + 6); // End of week (Saturday)
      end.setHours(23, 59, 59, 999);
      return [start, end];
    }
    case "this-month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      const end = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        0,
        23,
        59,
        59,
        999
      );
      return [start, end];
    }
    default:
      return [null, null];
  }
};

// Helper function to normalize date to start of day
const normalizeDate = (date) => {
  if (!date) return null;
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized;
};

function EmptyState() {
  return (
    <Table.Tr>
      <Table.Td colSpan={7}>
        <Center h={100}>
          <Stack align="center" gap="md">
            <Text size="lg" fw={500} c="dimmed">
              No appointments found
            </Text>
          </Stack>
        </Center>
      </Table.Td>
    </Table.Tr>
  );
}

function AppointmentsTable({ appointments = [], onAppointmentClick }) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateMenuOpened, setDateMenuOpened] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { updateAppointment, deleteAppointment } = useAppointmentQueries();

  // Handle preset date range selection
  const handleDatePreset = (preset) => {
    const range = getDateRange(preset);
    setDateRange(range);
  };

  // Format date range for display
  const getDateRangeDisplay = () => {
    if (!dateRange[0] || !dateRange[1]) return "Date Range";

    const formatDate = (date) => {
      if (!date || !(date instanceof Date)) return "";
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const startStr = formatDate(dateRange[0]);
    const endStr = formatDate(dateRange[1]);

    if (!startStr || !endStr) return "Date Range";
    return `${startStr} - ${endStr}`;
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

  // Filter appointments based on status and date range
  const filteredAppointments = appointments.filter((appointment) => {
    // First check status
    const matchesStatus =
      statusFilter === "all" || appointment.status === statusFilter;
    if (!matchesStatus) return false;

    // If no date range is selected, return based on status only
    if (!dateRange[0] || !dateRange[1]) return true;

    try {
      // Convert appointment date string to Date object
      const appointmentDate = normalizeDate(new Date(appointment.date));
      const startDate = normalizeDate(dateRange[0]);
      const endDate = normalizeDate(dateRange[1]);

      // Debug log
      console.log("Filtering:", {
        appointmentDate: appointmentDate?.toISOString(),
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        isInRange: appointmentDate >= startDate && appointmentDate <= endDate,
      });

      // Check if date is valid
      if (!appointmentDate || !startDate || !endDate) return true;

      // Compare dates
      return appointmentDate >= startDate && appointmentDate <= endDate;
    } catch (e) {
      console.error("Error filtering appointment date:", e);
      return true;
    }
  });

  const handleScroll = ({ y }) => {
    // y is the vertical scroll position
    // You can use y to determine if at bottom or not
    if (!viewport.current) return;
    const scrollArea = viewport.current;
    const scrollHeight = scrollArea.scrollHeight;
    const clientHeight = scrollArea.clientHeight;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - y) < 1;
    setIsScrolling(!isAtBottom);
  };

  const handleRowClick = (appointment) => {
    // To be implemented: show details modal or navigate
    if (onAppointmentClick) {
      onAppointmentClick(appointment);
    }
  };

  return (
    <Stack>
      <Group mt={"sm"} justify="start" w="100%" mb="md">
        <Group gap="md">
          <SegmentedControl
            size="md"
            radius={"md"}
            value={statusFilter}
            onChange={setStatusFilter}
            data={[
              { label: "All", value: "all" },
              { label: "Scheduled", value: "Scheduled" },
              { label: "Completed", value: "Completed" },
              { label: "Cancelled", value: "Cancelled" },
            ]}
          />

          <Menu
            shadow="md"
            radius={"lg"}
            opened={dateMenuOpened}
            onChange={setDateMenuOpened}
            position="bottom-start"
            width={"targetWidth"}
          >
            <Menu.Target>
              <Button
                size="md"
                radius={"md"}
                variant="subtle"
                rightSection={<IconCaretDownFilled color="black" size={18} />}
              >
                {getDateRangeDisplay()}
              </Button>
            </Menu.Target>

            <Menu.Dropdown p={"md"}>
              <Stack gap="xs">
                <Group py={"sm"} w={"100%"} justify="left">
                  <Button
                    size="md"
                    radius={"md"}
                    variant="subtle"
                    onClick={() => handleDatePreset("today")}
                  >
                    Today
                  </Button>
                  <Button
                    size="md"
                    radius={"md"}
                    variant="subtle"
                    onClick={() => handleDatePreset("this-week")}
                  >
                    This Week
                  </Button>
                  <Button
                    radius={"md"}
                    size="md"
                    variant="subtle"
                    onClick={() => handleDatePreset("this-month")}
                  >
                    This Month
                  </Button>
                </Group>
                <DatePicker
                  size="md"
                  type="range"
                  value={dateRange}
                  onChange={(newRange) => {
                    // Ensure end date includes the full day
                    const [start, end] = newRange;
                    if (start && end) {
                      const adjustedEnd = new Date(end);
                      adjustedEnd.setHours(23, 59, 59, 999);
                      setDateRange([start, adjustedEnd]);
                    } else {
                      setDateRange(newRange);
                    }
                  }}
                  numberOfColumns={2}
                />
              </Stack>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      <Table verticalSpacing="sm" highlightOnHover>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>ID</Table.Th>
            <Table.Th>Patient</Table.Th>
            <Table.Th>Doctor</Table.Th>
            <Table.Th>Clinic</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Time</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {filteredAppointments.length === 0 ? (
            <EmptyState />
          ) : (
            filteredAppointments.map((appointment) => (
              <Table.Tr
                key={appointment.id}
                style={{ cursor: "pointer" }}
                onClick={() => handleRowClick(appointment)}
              >
                <Table.Td>{appointment.id}</Table.Td>
                <Table.Td>{appointment.patientName}</Table.Td>
                <Table.Td>{appointment.doctorName}</Table.Td>
                <Table.Td>{appointment.clinicName}</Table.Td>
                <Table.Td>
                  {appointment.displayDate || appointment.date}
                </Table.Td>
                <Table.Td>{appointment.time}</Table.Td>
                <Table.Td>
                  <Badge
                    color={
                      appointment.status === "Completed"
                        ? "green"
                        : appointment.status === "Cancelled"
                        ? "red"
                        : "blue"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {/* Edit Modal */}
      <Modal
        opened={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Appointment"
        size="lg"
      >
        {selectedAppointment && (
          <AppointmentForm
            initialValues={{
              doctorId: selectedAppointment.doctor?.id?.toString(),
              patientName: selectedAppointment.patientName,
              patientPhone: selectedAppointment.patientPhone || "",
              startTime: new Date(selectedAppointment.rawDate),
              notes: selectedAppointment.notes || "",
            }}
            onSubmit={handleUpdate}
            isLoading={updateAppointment.isPending}
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
    </Stack>
  );
}

export default AppointmentsTable;
