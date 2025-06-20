import {
  Container,
  TextInput,
  Title,
  Group,
  Paper,
  Button,
  Stack,
} from "@mantine/core";
import { IconPlus, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { PatientsTable } from "../components/PatientsTable";

export default function Patients() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddPatientClick = () => {
    // TODO: Implement add patient functionality
    console.log("Add patient clicked");
  };

  return (
    <Container pt={12} maw={1232} fluid>
      <Stack>
        <Title fz={"24px"} order={2}>
          Patients
        </Title>
        <Group mt={40} justify="space-between">
          <TextInput
            size="lg"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftSection={<IconSearch size={16} />}
            style={{ flex: 1, maxWidth: 300 }}
            radius="md"
          />
          <Button
            size="lg"
            variant="outline"
            leftSection={<IconPlus size={20} />}
            onClick={handleAddPatientClick}
            radius="xl"
          >
            Add New Patient
          </Button>
        </Group>

        <Paper radius={"md"} withBorder>
          <PatientsTable searchQuery={searchQuery} />
        </Paper>
      </Stack>
    </Container>
  );
}
