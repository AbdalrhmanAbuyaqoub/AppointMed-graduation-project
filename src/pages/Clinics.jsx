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
  Center,
} from "@mantine/core";
import { IconPlus, IconBuildingHospital } from "@tabler/icons-react";
import { ClinicCard } from "../components/ClinicCard";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useState } from "react";
import { CreateClinicModal } from "../components/CreateClinicModal";
import useSearchStore from "../store/useSearchStore";

function Clinics() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { searchQuery } = useSearchStore();
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
    <Container pt={12} maw={1232} fluid>
      <Stack>
        <Title fz={"24px"} fw={700} order={2}>
          Clinics Management
        </Title>
        <Group mt={40} justify="flex-end">
          <Button
            size="lg"
            radius="xl"
            variant="outline"
            leftSection={<IconPlus size={20} />}
            onClick={() => setIsModalOpen(true)}
          >
            New Clinic
          </Button>
        </Group>

        <Divider />

        {!clinics || clinics.length === 0 ? (
          renderEmptyState("No clinics found.")
        ) : filteredClinics.length === 0 ? (
          renderEmptyState("No clinics found matching your search.")
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing="xl">
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
