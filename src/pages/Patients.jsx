import { Container, Title, Paper, Stack } from "@mantine/core";
import { PatientsTable } from "../components/PatientsTable";
import useSearchStore from "../store/useSearchStore";

export default function Patients() {
  const { searchQuery } = useSearchStore();

  return (
    <Container pt={12} maw={1232} fluid>
      <Stack>
        <Title fz={"24px"} order={2}>
          Patients
        </Title>

        <Paper mt={40} radius={"md"} withBorder>
          <PatientsTable searchQuery={searchQuery} />
        </Paper>
      </Stack>
    </Container>
  );
}
