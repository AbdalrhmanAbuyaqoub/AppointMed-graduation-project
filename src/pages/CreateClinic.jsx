import {
  Container,
  Title,
  Stack,
  TextInput,
  Button,
  Group,
  Paper,
  ActionIcon,
  Grid,
  Text,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useState } from "react";
import { IconArrowLeft } from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

function CreateClinic() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { createClinic, isCreating } = useClinicQueries();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!name.trim()) {
        notifications.show({
          title: "Error",
          message: "Clinic name is required",
          color: "red",
        });
        return;
      }

      await createClinic({ name: name.trim() });
      navigate("/clinics");
    } catch (error) {
      console.error("Error creating clinic:", error);
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create clinic",
        color: "red",
      });
    }
  };

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Group justify="space-between">
          <Group>
            <ActionIcon
              variant="subtle"
              onClick={() => navigate("/clinics")}
              size="lg"
            >
              <IconArrowLeft size={20} />
            </ActionIcon>
            <Title order={2}>Create New Clinic</Title>
          </Group>
        </Group>

        <Grid>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper withBorder p="md" radius="md">
              <form onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Title order={3}>Basic Information</Title>

                  <Group align="flex-start">
                    <Text fw={500}>Clinic Name:</Text>
                    <TextInput
                      placeholder="Enter clinic name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      withAsterisk
                      error={null}
                      style={{ flex: 1 }}
                    />
                  </Group>

                  <Group justify="flex-end" mt="md">
                    <Button
                      variant="light"
                      onClick={() => navigate("/clinics")}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" loading={isCreating}>
                      Create Clinic
                    </Button>
                  </Group>
                </Stack>
              </form>
            </Paper>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}

export default CreateClinic;
