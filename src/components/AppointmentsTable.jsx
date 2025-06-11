import {
  Table,
  Text,
  Button,
  Group,
  Badge,
  Menu,
  Stack,
  Divider,
  Center,
  ActionIcon,
  SegmentedControl,
  Modal,
  Pagination,
} from "@mantine/core";
import {
  IconEdit,
  IconTrash,
  IconCaretDownFilled,
  IconDotsVertical,
} from "@tabler/icons-react";
import { DatePicker } from "@mantine/dates";
import { useState, useEffect } from "react";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import { notifications } from "@mantine/notifications";
import AppointmentForm from "./AppointmentForm";
import AppointmentDetailsDrawer from "./AppointmentDetailsDrawer";

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

function EmptyState({ searchQuery, hasFilters }) {
  const getMessage = () => {
    if (searchQuery) {
      return "No appointments found matching your search";
    }
    if (hasFilters) {
      return "No appointments found with the current filters";
    }
    return "No appointments found";
  };

  return (
    <Table.Tr>
      <Table.Td colSpan={7}>
        <Center h={100}>
          <Stack align="center" gap="md">
            <Text size="lg" fw={500} c="dimmed">
              {getMessage()}
            </Text>
          </Stack>
        </Center>
      </Table.Td>
    </Table.Tr>
  );
}

function AppointmentsTable({
  appointments = [],
  onAppointmentClick,
  searchQuery = "",
}) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateRange, setDateRange] = useState([null, null]);
  const [dateMenuOpened, setDateMenuOpened] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);
  const [filteredAppointments, setFilteredAppointments] =
    useState(appointments);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { updateAppointment, deleteAppointment, updateAppointmentStatus } =
    useAppointmentQueries();

  // Status mapping
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

  // Update filteredAppointments when appointments prop changes
  useEffect(() => {
    setFilteredAppointments(appointments);
  }, [appointments]);

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

  // Filter appointments based on status, date range, and search query
  useEffect(() => {
    const filtered = appointments.filter((appointment) => {
      // First check status filter
      const matchesStatus =
        statusFilter === "all" || appointment.status === parseInt(statusFilter);
      if (!matchesStatus) return false;

      // Then check search query if it exists
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase().trim();

        // Search only in patient name and appointment ID
        const searchableFields = [
          appointment.patientName,
          appointment.id?.toString(),
        ];

        // Check if any field contains the search query
        const matchesSearch = searchableFields.some((field) =>
          field?.toLowerCase().includes(searchLower)
        );

        if (!matchesSearch) return false;
      }

      // Finally check date range if selected
      if (!dateRange[0] || !dateRange[1]) return true;

      try {
        // Convert appointment date string to Date object
        const appointmentDate = normalizeDate(new Date(appointment.date));
        const startDate = normalizeDate(dateRange[0]);
        const endDate = normalizeDate(dateRange[1]);

        // Check if date is valid
        if (!appointmentDate || !startDate || !endDate) return true;

        // Compare dates
        return appointmentDate >= startDate && appointmentDate <= endDate;
      } catch (e) {
        console.error("Error filtering appointment date:", e);
        return true;
      }
    });

    setFilteredAppointments(filtered);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [appointments, statusFilter, searchQuery, dateRange]);

  // Calculate pagination values
  const totalPages = Math.ceil(filteredAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAppointments = filteredAppointments.slice(
    startIndex,
    endIndex
  );

  // Handle status update
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

      // Update the local appointment status
      const updatedAppointments = filteredAppointments.map((appointment) => {
        if (appointment.id === appointmentId) {
          return {
            ...appointment,
            status: result.newStatus, // Update numeric status only
          };
        }
        return appointment;
      });

      // Update the filtered appointments
      setFilteredAppointments(updatedAppointments);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update appointment status",
        color: "red",
      });
    }
  };

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
    // Open details drawer instead of navigating to a new page
    setSelectedAppointment(appointment);
    setIsDetailsDrawerOpen(true);

    // Also call the optional callback if provided
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
              { label: "Scheduled", value: "0" },
              { label: "Completed", value: "2" },
              { label: "Cancelled", value: "1" },
              { label: "No Show", value: "3" },
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
                    size="sm"
                    radius={"md"}
                    variant="subtle"
                    onClick={() => handleDatePreset("today")}
                  >
                    Today
                  </Button>
                  <Button
                    size="sm"
                    radius={"md"}
                    variant="subtle"
                    onClick={() => handleDatePreset("this-week")}
                  >
                    This Week
                  </Button>
                  <Button
                    radius={"md"}
                    size="sm"
                    variant="subtle"
                    onClick={() => handleDatePreset("this-month")}
                  >
                    This Month
                  </Button>
                </Group>
                <DatePicker
                  size="sm"
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
            <Table.Th>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedAppointments.length === 0 ? (
            <EmptyState
              searchQuery={searchQuery}
              hasFilters={
                statusFilter !== "all" || (dateRange[0] && dateRange[1])
              }
            />
          ) : (
            paginatedAppointments.map((appointment) => {
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
                  <Table.Td>{appointment.patientName}</Table.Td>
                  <Table.Td>{appointment.doctorName}</Table.Td>
                  <Table.Td>{appointment.clinicName}</Table.Td>
                  <Table.Td>
                    {appointment.displayDate || appointment.date}
                  </Table.Td>
                  <Table.Td>{appointment.time}</Table.Td>
                  <Table.Td>
                    <Badge color={statusColor}>{statusText}</Badge>
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
                            onClick={() =>
                              handleStatusUpdate(appointment.id, 0)
                            }
                            color="blue"
                          >
                            Mark as Scheduled
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              handleStatusUpdate(appointment.id, 1)
                            }
                            color="red"
                          >
                            Mark as Cancelled
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              handleStatusUpdate(appointment.id, 2)
                            }
                            color="green"
                          >
                            Mark as Completed
                          </Menu.Item>
                          <Menu.Item
                            onClick={() =>
                              handleStatusUpdate(appointment.id, 3)
                            }
                            color="orange"
                          >
                            Mark as No Show
                          </Menu.Item>

                          <Menu.Divider />

                          <Menu.Label>Actions</Menu.Label>
                          <Menu.Item
                            leftSection={<IconEdit size={14} />}
                            onClick={() => handleEdit(appointment)}
                          >
                            Edit
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<IconTrash size={14} />}
                            color="red"
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setIsDeleteModalOpen(true);
                            }}
                          >
                            Delete
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              );
            })
          )}
        </Table.Tbody>
      </Table>

      {/* Pagination */}
      {/* Display pagination info */}
      {filteredAppointments.length > 0 && (
        <Group justify="space-between" mt="md">
          <Text size="sm" c="dimmed">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredAppointments.length)} of{" "}
            {filteredAppointments.length} appointments
          </Text>
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
            size="sm"
            radius="md"
            withEdges
          />
          {totalPages > 1 && (
            <Text size="sm" c="dimmed">
              Page {currentPage} of {totalPages}
            </Text>
          )}
        </Group>
      )}

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
    </Stack>
  );
}

export default AppointmentsTable;
