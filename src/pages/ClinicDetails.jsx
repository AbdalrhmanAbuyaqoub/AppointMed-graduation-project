import {
  Container,
  Title,
  Stack,
  Grid,
  Paper,
  Text,
  Group,
  Button,
  Badge,
  ActionIcon,
  TextInput,
  Card,
  LoadingOverlay,
  Modal,
  Box,
  Avatar,
  Divider,
  SimpleGrid,
  Center,
  Table,
  useMantineTheme,
} from "@mantine/core";
import { useParams, useNavigate } from "react-router-dom";
import {
  IconArrowLeft,
  IconUserPlus,
  IconEdit,
  IconCheck,
  IconX,
  IconTrash,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBuildingHospital,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useClinicQueries } from "../hooks/useClinicQueries";
import NotificationService from "../services/NotificationService";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import CreateDoctorDrawer from "../components/CreateDoctorDrawer";
import { getUserInitials } from "../utils/userUtils";

function ClinicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const [newDoctorData, setNewDoctorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    selectedClinic: id ? id.toString() : "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const {
    clinic,
    doctors,
    isLoading,
    isError,
    error,
    addDoctor,
    updateClinic,
    deleteClinic,
    isAddingDoctor,
    isUpdating,
    isDeleting,
  } = useClinicQueries(Number(id));

  const handleAddDoctor = async () => {
    if (!newDoctorData.firstName.trim()) {
      NotificationService.error("Error", "Doctor first name is required");
      return;
    }
    if (!newDoctorData.lastName.trim()) {
      NotificationService.error("Error", "Doctor last name is required");
      return;
    }
    if (!newDoctorData.email.trim()) {
      NotificationService.error("Error", "Doctor email is required");
      return;
    }
    if (!newDoctorData.phoneNumber.trim()) {
      NotificationService.error("Error", "Doctor phone number is required");
      return;
    }

    const doctorData = {
      clinicId: Number(id),
      firstName: newDoctorData.firstName.trim(),
      lastName: newDoctorData.lastName.trim(),
      email: newDoctorData.email.trim(),
      address: newDoctorData.address.trim(),
      phoneNumber: newDoctorData.phoneNumber.trim(),
    };

    await addDoctor(doctorData);
    setNewDoctorData({
      firstName: "",
      lastName: "",
      email: "",
      address: "",
      phoneNumber: "",
      selectedClinic: id ? id.toString() : "",
    });
  };

  const handleStartEditing = () => {
    setEditedName(clinic.name);
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditedName("");
    setIsEditing(false);
  };

  const handleSaveClinicName = async () => {
    if (!editedName.trim() || editedName === clinic.name) {
      handleCancelEditing();
      return;
    }

    try {
      await updateClinic({
        id: Number(id),
        name: editedName.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      // Error is handled by the mutation
      console.error("Failed to update clinic name:", error);
    }
  };

  const handleDelete = async () => {
    // Check if clinic has doctors
    if (doctors && doctors.length > 0) {
      NotificationService.error(
        "Cannot Delete Clinic",
        `This clinic has ${doctors.length} doctor${
          doctors.length !== 1 ? "s" : ""
        } assigned to it. Please remove all doctors before deleting the clinic.`
      );
      setIsDeleteModalOpen(false);
      return;
    }

    try {
      await deleteClinic(Number(id));
      navigate(-1);
    } catch (error) {
      console.error("Failed to delete clinic:", error);
      // The error notification is already handled by the mutation
      // but we'll close the modal in case it stays open
      setIsDeleteModalOpen(false);
    }
  };

  if (isLoading) {
    return (
      <Container pt={20} maw={1232} fluid>
        <LoadingOverlay visible />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container pt={20} maw={1232} fluid>
        <Group mb="xl">
          <ActionIcon variant="subtle" onClick={() => navigate(-1)} size="lg">
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={2}>Clinic Not Found</Title>
        </Group>
        <Paper radius="md" p="xl" withBorder>
          <Center>
            <Text c="red">Error: {error.message}</Text>
          </Center>
        </Paper>
      </Container>
    );
  }

  if (!clinic) {
    return (
      <Container pt={20} maw={1232} fluid>
        <Group mb="xl">
          <ActionIcon variant="subtle" onClick={() => navigate(-1)} size="lg">
            <IconArrowLeft size={20} />
          </ActionIcon>
          <Title order={2}>Clinic Not Found</Title>
        </Group>
        <Paper radius="md" p="xl" withBorder>
          <Center>
            <Text c="dimmed">The requested clinic could not be found.</Text>
          </Center>
        </Paper>
      </Container>
    );
  }

  return (
    <Container pt={20} maw={1232} fluid>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Clinic"
        itemName={`"${clinic.name}"`}
        isLoading={isDeleting}
        additionalMessage={
          doctors && doctors.length === 0
            ? "This clinic has no doctors assigned to it."
            : null
        }
      />

      <Group mb="xl">
        <ActionIcon variant="subtle" onClick={() => navigate(-1)} size="lg">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>Clinic Details</Title>
      </Group>

      {/* Profile Information Card */}
      <Paper p="xl" radius="md" withBorder maw={800}>
        <Stack gap="xl">
          {/* Header with Avatar and Name */}
          <Group gap="xl" align="flex-start">
            <Avatar
              size="xl"
              radius="50%"
              variant="filled"
              color="var(--mantine-primary-color-filled)"
            >
              <IconBuildingHospital size={40} />
            </Avatar>

            <Stack gap="xs" style={{ flex: 1 }}>
              {isEditing ? (
                <Group>
                  <TextInput
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    error={!editedName.trim() ? "Name is required" : null}
                    size="md"
                    style={{ flex: 1 }}
                  />
                  <ActionIcon
                    color="green"
                    onClick={handleSaveClinicName}
                    loading={isUpdating}
                    disabled={!editedName.trim() || editedName === clinic.name}
                    size="lg"
                  >
                    <IconCheck size={20} />
                  </ActionIcon>
                  <ActionIcon
                    color="red"
                    onClick={handleCancelEditing}
                    size="lg"
                  >
                    <IconX size={20} />
                  </ActionIcon>
                </Group>
              ) : (
                <Group>
                  <Title order={2} fz={28}>
                    {clinic.name}
                  </Title>
                  <ActionIcon
                    variant="subtle"
                    onClick={handleStartEditing}
                    c={"black"}
                  >
                    <IconEdit size={20} />
                  </ActionIcon>
                </Group>
              )}
              <Group gap="md">
                <Badge size="lg" variant="filled" color="blue">
                  CLINIC
                </Badge>
              </Group>
            </Stack>

            <Stack align="flex-end" gap="xs">
              {doctors.length > 0 && (
                <Text size="xs" c="orange" fw={500} ta="right">
                  Remove all doctors to enable deletion
                </Text>
              )}
              <Button
                color="red"
                radius="md"
                variant="outline"
                leftSection={<IconTrash size={16} />}
                onClick={() => setIsDeleteModalOpen(true)}
                loading={isDeleting}
                disabled={doctors && doctors.length > 0}
                title={
                  doctors && doctors.length > 0
                    ? `Cannot delete clinic with ${doctors.length} doctor${
                        doctors.length !== 1 ? "s" : ""
                      } assigned`
                    : "Delete clinic"
                }
              >
                Delete Clinic
              </Button>
            </Stack>
          </Group>
          {/* <Divider /> */}
          {/* Clinic Details Grid */}
          {/* <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl"> */}
          {/* Basic Information
            <Stack gap="md">
              <Title order={3} size="h4">
                Basic Information
              </Title>
              <Group gap="md">
                <IconBuildingHospital
                  size={20}
                  color="var(--mantine-color-gray-6)"
                />
                <Text size="sm" fw={500}>
                  Clinic Name:
                </Text>
                <Text size="sm">{clinic.name}</Text>
              </Group>
              <Group gap="md">
                <IconUser size={20} color="var(--mantine-color-gray-6)" />
                <Text size="sm" fw={500}>
                  Total Doctors:
                </Text>
                <Text size="sm">{doctors.length}</Text>
              </Group>
            </Stack> */}
          {/* Additional Information */}
          {/* <Stack gap="md">
              <Title order={3} size="h4">
                Additional Information
              </Title>
              <Group gap="md">
                <Text size="sm" c="dimmed">
                  This section can be expanded with more clinic details as
                  needed.
                </Text>
              </Group>
            </Stack> */}
          {/* </SimpleGrid> */}
        </Stack>
      </Paper>

      {/* Doctors Section */}
      <Paper p="xl" mt="xl" radius="md" withBorder maw={800}>
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={3}>Doctors</Title>
            <Group gap="xs">
              <IconUser size={20} color="var(--mantine-color-gray-6)" />
              <Text size="sm" c="dimmed">
                {doctors.length} doctor{doctors.length !== 1 ? "s" : ""}
              </Text>
              <Button
                variant="filled"
                radius="md"
                leftSection={<IconUserPlus size={16} />}
                onClick={() => setIsDrawerOpen(true)}
                ml="md"
              >
                new Doctor
              </Button>
            </Group>
          </Group>

          {doctors.length === 0 ? (
            <Center py="xl">
              <Stack align="center" gap="md">
                <IconUser size={48} opacity={0.4} />
                <Text size="lg" c="dimmed">
                  No doctors assigned
                </Text>
                <Text size="sm" c="dimmed">
                  This clinic has no doctors assigned to it yet.
                </Text>
              </Stack>
            </Center>
          ) : (
            <Table highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th c="dimmed">Name</Table.Th>
                  <Table.Th c="dimmed">Email</Table.Th>
                  <Table.Th c="dimmed">Phone</Table.Th>
                  <Table.Th c="dimmed">Address</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {doctors.map((doctor) => (
                  <Table.Tr
                    key={doctor.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/doctors/${doctor.id}`)}
                  >
                    <Table.Td>
                      <Group gap="sm">
                        <Avatar
                          size="sm"
                          radius="50%"
                          variant="filled"
                          color="gray.3"
                        >
                          <Text size="xs">
                            {getUserInitials({ fullName: doctor.name })}
                          </Text>
                        </Avatar>
                        <Text size="sm" fw={500}>
                          {doctor.name}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconMail size={16} opacity={0.6} />
                        <Text size="sm">{doctor.email || "Not provided"}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconPhone size={16} opacity={0.6} />
                        <Text size="sm">
                          {doctor.phoneNumber || "Not provided"}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Group gap="xs">
                        <IconMapPin size={16} opacity={0.6} />
                        <Text size="sm">
                          {doctor.address || "Not provided"}
                        </Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
        </Stack>
      </Paper>

      <CreateDoctorDrawer
        opened={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSubmit={handleAddDoctor}
        doctorData={newDoctorData}
        setDoctorData={setNewDoctorData}
        isLoading={isAddingDoctor}
        clinicId={Number(id)}
      />
    </Container>
  );
}

export default ClinicDetails;
