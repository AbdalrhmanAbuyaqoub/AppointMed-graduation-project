import { Container, Title, Text } from "@mantine/core";

function Dashboard() {
  return (
    <Container>
      <Title order={1}>Dashboard</Title>
      <Text>Welcome to your dashboard. This is a protected route.</Text>
    </Container>
  );
}

export default Dashboard;
