import { useParams, useNavigate } from "react-router-dom";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import {
  Container,
  Stack,
  Title,
  Text,
  Button,
  Group,
  Loader,
  Paper,
} from "@mantine/core";
import { useEffect } from "react";

function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getAppointmentById } = useAppointmentQueries();
  const { data: appointment, isLoading, error } = getAppointmentById(id);

  useEffect(() => {
    if (!id) {
      navigate("/appointments");
    }
  }, [id, navigate]);

  if (isLoading) {
    return (
      <Container pt={40}>
        <Loader />
      </Container>
    );
  }

  if (error || !appointment) {
    return (
      <Container pt={40}>
        <Text color="red">Error loading appointment details.</Text>
        <Button mt="md" onClick={() => navigate("/appointments")}>
          Back to Appointments
        </Button>
      </Container>
    );
  }

  return (
    <Container pt={40} maw={600}>
      <Paper withBorder radius="md" p="xl" shadow="sm">
        <Stack gap="md">
          <Title order={2}>Appointment Details</Title>
          <Text>
            <b>ID:</b> {appointment.id}
          </Text>
          <Text>
            <b>Patient:</b> {appointment.patientName}
          </Text>
          <Text>
            <b>Doctor:</b> {appointment.doctor?.name || "N/A"}
          </Text>
          <Text>
            <b>Clinic:</b> {appointment.doctor?.clinicName || "N/A"}
          </Text>
          <Text>
            <b>Date:</b>{" "}
            {appointment.startDate
              ? new Date(appointment.startDate).toLocaleDateString()
              : "-"}
          </Text>
          <Text>
            <b>Time:</b>{" "}
            {appointment.startDate
              ? new Date(appointment.startDate).toLocaleTimeString()
              : "-"}
          </Text>
          <Text>
            <b>Status:</b> {appointment.status || "Scheduled"}
          </Text>
          <Text>
            <b>Phone:</b> {appointment.patientPhone}
          </Text>
          <Text>
            <b>Notes:</b> {appointment.notes || "-"}
          </Text>
          <Group mt="md">
            <Button color="blue" variant="outline">
              Edit
            </Button>
            <Button color="red" variant="outline">
              Delete
            </Button>
            <Button variant="subtle" onClick={() => navigate("/appointments")}>
              Back
            </Button>
          </Group>
        </Stack>
      </Paper>
    </Container>
  );
}

export default AppointmentDetails;
