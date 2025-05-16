import { Container, Title, Paper, Stack } from "@mantine/core";

function Appointments() {
  return (
    <Container fluid maw={1232}>
      <Stack gap={100}>
        <Title order={2}>Appointments Management</Title>
        <Paper withBorder radius={"md"} h={500} shadow="sm"></Paper>
      </Stack>
    </Container>
  );
}

export default Appointments;
