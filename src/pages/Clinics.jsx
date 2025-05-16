import {
  Stack,
  Title,
  Container,
  SimpleGrid,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Divider,
  Text,
  TextInput,
  Center,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconBuildingHospital,
} from "@tabler/icons-react";
import { ClinicCard } from "../components/ClinicCard";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useState } from "react";
import { CreateClinicModal } from "../components/CreateClinicModal";

function Clinics() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const {
    clinics = [], // Provide default empty array
    isLoading,
    isError,
    error,
  } = useClinicQueries();

  // Filter clinics based on search query
  const filteredClinics = clinics.filter((clinic) =>
    clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle error state
  if (isError) {
    return (
      <Container>
        <Text c="red">Error: {error?.message || "An error occurred"}</Text>
      </Container>
    );
  }

  // Handle loading state
  if (isLoading) {
    return (
      <Container>
        <LoadingOverlay visible />
        <Text>Loading clinics...</Text>
      </Container>
    );
  }

  const renderEmptyState = (message) => (
    <Center>
      <Stack align="center" gap="md">
        <IconBuildingHospital size={50} opacity={0.4} />
        <Text size="lg" fw={400} c="dimmed">
          {message}
        </Text>
      </Stack>
    </Center>
  );

  // Render clinics grid
  return (
    <Container pt={20} maw={1232} fluid>
      <Stack>
        <Stack gap={40} mb={50}>
          <Title order={2}>Clinics Management</Title>
          <Group justify="space-between">
            <TextInput
              placeholder="Search clinics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftSection={<IconSearch size={16} />}
              style={{ flex: 1, maxWidth: 300 }}
              size="md"
              radius="md"
            />
            <Button
              size="md"
              leftSection={<IconPlus size={20} />}
              onClick={() => setIsModalOpen(true)}
              radius="md"
            >
              Add New Clinic
            </Button>
          </Group>
        </Stack>

        <Divider mb={20} />

        {!clinics || clinics.length === 0 ? (
          renderEmptyState("No clinics found.")
        ) : filteredClinics.length === 0 ? (
          renderEmptyState("No clinics found matching your search.")
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing="xl">
            {filteredClinics.map((clinic) => (
              <ClinicCard
                key={clinic.id}
                clinic={clinic}
                doctors={clinic.doctors}
              />
            ))}
          </SimpleGrid>
        )}
      </Stack>
      <CreateClinicModal
        opened={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Container>
  );
}

export default Clinics;
