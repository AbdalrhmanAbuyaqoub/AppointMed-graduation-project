import { useParams, useNavigate } from "react-router-dom";
import { useDoctorQueries } from "../hooks/useDoctorQueries";
import {
  Badge,
  Group,
  Stack,
  Text,
  Container,
  Avatar,
  Title,
  Button,
  TextInput,
  ActionIcon,
  Paper,
  Box,
  useMantineTheme,
  SimpleGrid,
  Divider,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconTrash,
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
  IconUser,
  IconCircleCheck,
  IconBuildingHospital,
} from "@tabler/icons-react";
import { useState } from "react";
import WorkingHours from "../components/WorkingHours/WorkingHours";
import { getUserInitials } from "../utils/userUtils";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

export default function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const {
    doctors,
    isLoading,
    updateDoctor,
    deleteDoctor,
    isUpdating,
    isDeleting,
  } = useDoctorQueries();
  const [isEditing, setIsEditing] = useState(false);
  const [editedDoctor, setEditedDoctor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Find the specific doctor
  const doctor = doctors.find((d) => d.id === Number(id));

  const handleStartEditing = () => {
    // Split the name into firstName and lastName
    const nameParts = doctor.name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    setEditedDoctor({
      firstName,
      lastName,
      email: doctor.email,
      phoneNumber: doctor.phoneNumber,
      address: doctor.address,
    });
    setIsEditing(true);
  };

  const handleCancelEditing = () => {
    setEditedDoctor(null);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    try {
      await deleteDoctor(Number(id));
      navigate(-1);
    } catch (error) {
      // Error is already handled by the mutation
      console.error("Failed to delete doctor:", error);
    }
  };

  const handleSave = async () => {
    try {
      await updateDoctor({
        id: Number(id),
        firstName: editedDoctor.firstName,
        lastName: editedDoctor.lastName,
        email: editedDoctor.email,
        phoneNumber: editedDoctor.phoneNumber,
        address: editedDoctor.address,
      });

      setIsEditing(false);
    } catch (error) {
      // Error is already handled by the mutation
      console.error("Failed to update doctor information:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!doctor) {
    return <div>Doctor not found</div>;
  }

  return (
    <Container pt={20} maw={1232} fluid>
      <Group mb="xl">
        <ActionIcon variant="subtle" onClick={() => navigate(-1)} size="lg">
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>Doctor Details</Title>
      </Group>

      {/* Profile Information Card */}
      <Paper p="xl" radius="md" withBorder maw={1232}>
        <Stack gap="xl">
          {/* Header with Avatar and Name */}
          <Group gap="xl" align="flex-start">
            <Avatar size="xl" radius="50%" variant="filled" color="gray.3">
              <Text fz={30}>{getUserInitials({ fullName: doctor.name })}</Text>
            </Avatar>

            <Stack gap="xs" style={{ flex: 1 }}>
              <Title order={2} fz={28}>
                {doctor.name}
              </Title>
              <Group gap="md">
                <Badge size="lg" variant="filled" color="blue">
                  DOCTOR
                </Badge>
                <Badge variant="filled" size="lg">
                  {doctor.clinicName}
                </Badge>
              </Group>
            </Stack>
            {/* Action Buttons */}
            <Group gap="md">
              <Button
                leftSection={<IconEdit size={16} />}
                onClick={handleStartEditing}
                variant="outline"
                radius="md"
                // color="blue"
              >
                Edit Details
              </Button>

              <Button
                leftSection={<IconTrash size={16} />}
                onClick={() => setIsDeleteModalOpen(true)}
                variant="outline"
                color="red"
                radius="md"
                loading={isDeleting}
              >
                Delete Doctor
              </Button>
            </Group>
          </Group>

          <Divider />

          {isEditing ? (
            <Paper shadow="xs" p="xl" radius="md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
              >
                <Stack gap="md">
                  <TextInput
                    label="First Name"
                    value={editedDoctor.firstName}
                    onChange={(e) =>
                      setEditedDoctor({
                        ...editedDoctor,
                        firstName: e.target.value,
                      })
                    }
                    required
                  />
                  <TextInput
                    label="Last Name"
                    value={editedDoctor.lastName}
                    onChange={(e) =>
                      setEditedDoctor({
                        ...editedDoctor,
                        lastName: e.target.value,
                      })
                    }
                    required
                  />
                  <TextInput
                    label="Email"
                    type="email"
                    value={editedDoctor.email}
                    onChange={(e) =>
                      setEditedDoctor({
                        ...editedDoctor,
                        email: e.target.value,
                      })
                    }
                    required
                  />
                  <TextInput
                    label="Phone Number"
                    value={editedDoctor.phoneNumber}
                    onChange={(e) =>
                      setEditedDoctor({
                        ...editedDoctor,
                        phoneNumber: e.target.value,
                      })
                    }
                    required
                  />
                  <TextInput
                    label="Address"
                    value={editedDoctor.address}
                    onChange={(e) =>
                      setEditedDoctor({
                        ...editedDoctor,
                        address: e.target.value,
                      })
                    }
                  />
                  <Group justify="flex-end" mt="md">
                    <Button
                      radius="md"
                      variant="outline"
                      onClick={handleCancelEditing}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button radius="md" type="submit" loading={isUpdating}>
                      Save Changes
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Paper>
          ) : (
            <>
              {/* User Details Grid */}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
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
                    <Text size="sm">{doctor.name}</Text>
                  </Group>
                  <Group gap="md">
                    <IconMail size={20} color="var(--mantine-color-gray-6)" />
                    <Text size="sm" fw={500}>
                      Email:
                    </Text>
                    <Text size="sm">{doctor.email || "No email provided"}</Text>
                  </Group>
                  <Group gap="md">
                    <IconBuildingHospital
                      size={20}
                      color="var(--mantine-color-gray-6)"
                    />
                    <Text size="sm" fw={500}>
                      Clinic:
                    </Text>
                    <Text size="sm">{doctor.clinicName}</Text>
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
                    <Text size="sm">
                      {doctor.phoneNumber || "Not provided"}
                    </Text>
                  </Group>
                  <Group gap="md">
                    <IconMapPin size={20} color="var(--mantine-color-gray-6)" />
                    <Text size="sm" fw={500}>
                      Address:
                    </Text>
                    <Text size="sm">{doctor.address || "Not provided"}</Text>
                  </Group>
                </Stack>
              </SimpleGrid>

              {/* <Divider /> */}
            </>
          )}
        </Stack>
      </Paper>

      {/* Working Hours Section */}
      <Paper p="xl" mt="xl" radius="md" withBorder maw={1232}>
        <Stack gap="xl">
          <Group justify="space-between" align="center">
            <Title order={3}>Working Hours</Title>
          </Group>
          <WorkingHours doctorId={id} />
        </Stack>
      </Paper>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Doctor"
        itemName={`"${doctor.name}"`}
        isLoading={isDeleting}
        additionalMessage="This will permanently remove the doctor from the system."
      />
    </Container>
  );
}
