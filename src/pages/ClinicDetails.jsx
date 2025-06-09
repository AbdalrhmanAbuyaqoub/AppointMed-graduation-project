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
} from "@tabler/icons-react";
import { useState } from "react";
import { useClinicQueries } from "../hooks/useClinicQueries";
import NotificationService from "../services/NotificationService";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";
import CreateDoctorDrawer from "../components/CreateDoctorDrawer";

function ClinicDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
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
    try {
      await deleteClinic(Number(id));
      navigate("/clinics");
    } catch (error) {
      console.error("Failed to delete clinic:", error);
    }
  };

  if (isError) {
    return (
      <Container>
        <Text c="red">Error: {error.message}</Text>
      </Container>
    );
  }

  if (!clinic) {
    return (
      <Container>
        <Text>Loading clinic details...</Text>
      </Container>
    );
  }

  return (
    <Container ml={100} pt={20} maw={800} fluid>
      <LoadingOverlay visible={isLoading} />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Clinic"
        itemName={clinic.name}
        isLoading={isDeleting}
      />

      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <ActionIcon
              hiddenFrom="sm"
              variant="subtle"
              onClick={() => navigate("/clinics")}
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            {isEditing ? (
              <Group>
                <TextInput
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  error={!editedName.trim() ? "Name is required" : null}
                />
                <ActionIcon
                  color="green"
                  onClick={handleSaveClinicName}
                  loading={isUpdating}
                  disabled={!editedName.trim() || editedName === clinic.name}
                >
                  <IconCheck size={20} />
                </ActionIcon>
                <ActionIcon color="red" onClick={handleCancelEditing}>
                  <IconX size={20} />
                </ActionIcon>
              </Group>
            ) : (
              <Group>
                <Title order={2}>{clinic.name}</Title>
                <ActionIcon variant="subtle" onClick={handleStartEditing}>
                  <IconEdit size={20} />
                </ActionIcon>
              </Group>
            )}
          </Group>
          <Button
            color="red"
            variant="outline"
            leftSection={<IconTrash size={16} />}
            onClick={() => setIsDeleteModalOpen(true)}
            loading={isDeleting}
          >
            Delete Clinic
          </Button>
        </Group>

        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Title order={3}>Basic Information</Title>
            <Text>
              This section can be used for additional clinic information.
            </Text>
          </Stack>
        </Paper>

        <Paper withBorder p="md" radius="md">
          <Stack gap="md">
            <Group justify="space-between">
              <Title order={3}>Doctors</Title>
              <Button
                variant="outline"
                leftSection={<IconUserPlus size={16} />}
                onClick={() => setIsDrawerOpen(true)}
              >
                Add Doctor
              </Button>
            </Group>

            {doctors.length === 0 ? (
              <Text c="dimmed">No doctors assigned to this clinic</Text>
            ) : (
              <Stack gap="xs">
                {doctors.map((doctor) => (
                  <Paper
                    key={doctor.id}
                    withBorder
                    p="md"
                    radius="lg"
                    bg="gray.0"
                  >
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text fw={500} size="lg">
                          {doctor.name}
                        </Text>
                      </Group>
                      {doctor.email && (
                        <Group gap="xs">
                          <IconMail size={16} />
                          <Text size="sm">{doctor.email}</Text>
                        </Group>
                      )}
                      {doctor.phoneNumber && (
                        <Group gap="xs">
                          <IconPhone size={16} />
                          <Text size="sm">{doctor.phoneNumber}</Text>
                        </Group>
                      )}
                      {doctor.address && (
                        <Group gap="xs">
                          <IconMapPin size={16} />
                          <Text size="sm">{doctor.address}</Text>
                        </Group>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
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
      </Stack>
    </Container>
  );
}

export default ClinicDetails;
