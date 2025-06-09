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
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconArrowLeft,
  IconTrash,
  IconEdit,
  IconMail,
  IconPhone,
  IconMapPin,
} from "@tabler/icons-react";
import { useState } from "react";
import WorkingHours from "../components/WorkingHours/WorkingHours";

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
      notifications.show({
        title: "Success",
        message: "Doctor deleted successfully",
        color: "green",
      });
      navigate("/doctors");
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete doctor",
        color: "red",
      });
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

      notifications.show({
        title: "Success",
        message: "Doctor information updated successfully",
        color: "green",
      });
      setIsEditing(false);
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to update doctor information",
        color: "red",
      });
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
        <ActionIcon
          hiddenFrom="sm"
          variant="subtle"
          onClick={() => navigate("/doctors")}
          size="lg"
        >
          <IconArrowLeft size={20} />
        </ActionIcon>
        <Title order={2}>Doctor Details</Title>
      </Group>
      <Paper radius={"md"} p={"xl"} withBorder maw={800}>
        <Group gap={"xl"}>
          <Stack gap="lg">
            <Avatar size={80} radius={80} variant="filled">
              {doctor.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </Avatar>

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
                        variant="light"
                        onClick={handleCancelEditing}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button type="submit" loading={isUpdating}>
                        Save Changes
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Paper>
            ) : (
              <Stack gap={"md"} align="left">
                <Group>
                  <Title m={0} order={2} fw={600}>
                    {doctor.name}
                  </Title>
                  <Badge variant="light" size="lg">
                    {doctor.clinicName}
                  </Badge>
                </Group>
                <Badge c={"black"} color="gray.3">
                  id: {doctor.id}
                </Badge>

                <Group>
                  <Button
                    size="xs"
                    color="black"
                    variant="outline"
                    leftSection={<IconEdit size={16} />}
                    onClick={handleStartEditing}
                  >
                    Edit Details
                  </Button>
                  <Button
                    size="xs"
                    variant="outline"
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={handleDelete}
                    loading={isDeleting}
                  >
                    Delete Doctor
                  </Button>
                </Group>
              </Stack>
            )}
          </Stack>

          {/* Additional Information */}
          {!isEditing && (
            <Stack gap="md">
              <Title order={3}>Contact Information</Title>
              <Group>
                <IconMail size={20} stroke={1.5} color="gray" />
                <Text>{doctor.email}</Text>
              </Group>
              <Group>
                <IconPhone size={20} stroke={1.5} color="gray" />
                <Text>{doctor.phoneNumber}</Text>
              </Group>
              <Group>
                <IconMapPin size={20} stroke={1.5} color="gray" />
                <Text>{doctor.address || "No address provided"}</Text>
              </Group>

              {doctor.specialties && doctor.specialties.length > 0 && (
                <>
                  <Text fw={500}>Specialties:</Text>
                  <Group gap="xs">
                    {doctor.specialties.map((specialty) => (
                      <Badge key={specialty} variant="outline" size="sm">
                        {specialty}
                      </Badge>
                    ))}
                  </Group>
                </>
              )}
            </Stack>
          )}
        </Group>
      </Paper>
      <Paper p={"xl"} mt={"xl"} radius={"md"} withBorder maw={800}>
        <Stack gap={"xl"}>
          <Group justify="space-between" align="center">
            <Title order={3}>Working Hours</Title>
          </Group>
          <WorkingHours doctorId={id} />
        </Stack>
      </Paper>
    </Container>
  );
}
