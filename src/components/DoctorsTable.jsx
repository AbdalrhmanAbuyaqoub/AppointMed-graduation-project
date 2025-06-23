import {
  Table,
  Text,
  Badge,
  Group,
  Avatar,
  Divider,
  Skeleton,
  Stack,
  Center,
  rem,
  Title,
  Box,
} from "@mantine/core";
import { useDoctorQueries } from "../hooks/useDoctorQueries";
import {
  useAllDoctorsWorkingHours,
  DAYS_CONFIG,
} from "../hooks/useWorkingHoursQueries";
import { IconUserOff } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";

// Working Days Component
function WorkingDaysDisplay({ doctorId, workingDays }) {
  return (
    <Group gap="8">
      {DAYS_CONFIG.map((dayConfig) => {
        const isAvailable = workingDays.includes(dayConfig.value);
        return (
          <Box
            bg={isAvailable ? "violet" : "gray.4"}
            fw={500}
            p={4}
            h={24}
            w={24}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
            }}
            key={dayConfig.value}
            title={dayConfig.day}
          >
            <Text size="xs" fw={500} c="white">
              {dayConfig.letter}
            </Text>
          </Box>
        );
      })}
    </Group>
  );
}

export function DoctorsTable({ searchQuery = "" }) {
  const { doctors, isLoading } = useDoctorQueries();
  const { doctorsWorkingDays, isLoading: isLoadingWorkingHours } =
    useAllDoctorsWorkingHours();
  const navigate = useNavigate();

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  const handleClinicClick = (clinicId) => {
    navigate(`/clinics/${clinicId}`);
  };

  // Filter doctors based on search query
  const filteredDoctors = doctors.filter((doctor) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      doctor.name.toLowerCase().includes(searchLower) ||
      doctor.clinicName.toLowerCase().includes(searchLower)
    );
  });

  // Loading state with skeleton
  if (isLoading || isLoadingWorkingHours) {
    return (
      <Stack>
        <Skeleton height={40} radius="sm" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={50} radius="sm" mt="sm" />
        ))}
      </Stack>
    );
  }

  // Empty state for no doctors
  // if (!doctors || doctors.length === 0) {
  //   return (
  //     <Stack align="center" gap="md">
  //       <IconUserOff size="20" />
  //       <Text size="lg" fw={500} c="dimmed">
  //         No doctors found
  //       </Text>
  //     </Stack>
  //   );
  // }

  // Empty state for search results
  // if (filteredDoctors.length === 0) {
  //   return (
  //     <Center>
  //       <Stack align="center" gap="md">
  //         <Text size="lg" fw={500} c="dimmed">
  //           No doctors found matching your search
  //         </Text>
  //       </Stack>
  //     </Center>
  //   );
  // }

  function noDoctorsFound() {
    return <Text> No doctors found</Text>;
  }

  return (
    <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
      <Table.Thead>
        <Table.Tr>
          <Table.Th c="dimmed">Name</Table.Th>
          <Table.Th c="dimmed">Working Days</Table.Th>
          <Table.Th c="dimmed">Clinic</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {filteredDoctors.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={3}>
              <Center py="xl">
                <Stack align="center" gap="md">
                  <IconUserOff size={30} opacity={0.4} />
                  <Text size="sm" c="dimmed">
                    No doctors found
                  </Text>
                </Stack>
              </Center>
            </Table.Td>
          </Table.Tr>
        ) : (
          filteredDoctors.map((doctor) => (
            <Table.Tr
              key={doctor.id}
              style={{ cursor: "pointer" }}
              onClick={() => handleDoctorClick(doctor.id)}
            >
              <Table.Td>
                <Group gap="sm">
                  <Avatar
                    color="#e7edf6"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDoctorClick(doctor.id)}
                    size="md"
                    radius="xl"
                    variant="filled"
                  >
                    <Text fz="sm">
                      {doctor.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </Text>
                  </Avatar>
                  <Text
                    size="sm"
                    fw={600}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleDoctorClick(doctor.id)}
                  >
                    {doctor.name}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <WorkingDaysDisplay
                  doctorId={doctor.id}
                  workingDays={doctorsWorkingDays[doctor.id] || []}
                />
              </Table.Td>
              <Table.Td>
                <Badge
                  variant="light"
                  size="lg"
                  radius="sm"
                  px="md"
                  style={{
                    cursor: "pointer",
                  }}
                  onClick={() => handleClinicClick(doctor.clinicId)}
                >
                  {doctor.clinicName}
                </Badge>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
}
