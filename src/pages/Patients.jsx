import { Container, Title, Group, Paper, Button, Stack } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { PatientsTable } from "../components/PatientsTable";
import useSearchStore from "../store/useSearchStore";

export default function Patients() {
  const { searchQuery } = useSearchStore();

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
        <Group mt={40} justify="flex-end">
          <Button
            size="lg"
            variant="outline"
            leftSection={<IconPlus size={20} />}
            onClick={handleAddPatientClick}
            radius="xl"
          >
            New Patient
          </Button>
        </Group>

        <Paper radius={"md"} withBorder>
          <PatientsTable searchQuery={searchQuery} />
        </Paper>
      </Stack>
    </Container>
  );
}
