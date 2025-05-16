import { Title, Card, Text, Badge, Group, Button, Stack } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { IconStethoscope, IconCalendar } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";

export function ClinicCard({ clinic }) {
  const navigate = useNavigate();
  const { hovered, ref } = useHover();

  return (
    <Card
      ref={ref}
      shadow={hovered ? "md" : "sm"}
      padding="lg"
      radius="md"
      withBorder
      style={{
        transform: hovered ? "translateY(-3px)" : "none",
        transition: "transform 0.1s, box-shadow 0.1s",
      }}
    >
      <Stack gap="xs">
        <Title order={3} size="xl">
          {clinic.name}
        </Title>

        <Group gap="xs">
          <IconStethoscope size={18} />
          <Text size="sm" c="dimmed" fw={500}>
            {clinic.doctors?.length || 0}{" "}
            {!clinic.doctors?.length || clinic.doctors.length === 1
              ? "Doctor"
              : "Doctors"}
          </Text>
        </Group>

        {clinic.workingHours && (
          <Group gap="xs">
            <IconCalendar size={18} />
            <Text size="sm" c="dimmed" fw={500}>
              {clinic.workingHours}
            </Text>
          </Group>
        )}

        {clinic.specialties && clinic.specialties.length > 0 && (
          <Group gap="xs" mt="xs">
            {clinic.specialties.map((specialty) => (
              <Badge key={specialty} variant="light">
                {specialty}
              </Badge>
            ))}
          </Group>
        )}

        <Button
          variant="light"
          fullWidth
          mt="xl"
          radius="md"
          onClick={() => navigate(`/clinics/${clinic.id}`)}
        >
          Manage Clinic
        </Button>
      </Stack>
    </Card>
  );
}
