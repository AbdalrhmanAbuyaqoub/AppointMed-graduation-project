import {
  Table,
  Text,
  Badge,
  Group,
  Avatar,
  Skeleton,
  Stack,
  Center,
  Menu,
  ActionIcon,
  Switch,
} from "@mantine/core";
import { useUserQueries } from "../hooks/useUserQueries";
import {
  IconDotsVertical,
  IconEdit,
  IconUser,
  IconUserOff,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { getUserInitials } from "../utils/userUtils";

export function PatientsTable({ searchQuery = "" }) {
  const { patients, isLoading, banPatient, unbanPatient } = useUserQueries();
  const navigate = useNavigate();

  const handlePatientClick = (patientId) => {
    navigate(`/patients/${patientId}`);
  };

  const handleStatusToggle = (patientId, currentBannedStatus) => {
    if (currentBannedStatus) {
      unbanPatient(patientId);
    } else {
      banPatient(patientId);
    }
  };

  // Filter patients based on search query
  const filteredPatients = patients.filter((patient) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      patient.fullName.toLowerCase().includes(searchLower) ||
      patient.email.toLowerCase().includes(searchLower) ||
      (patient.phoneNumber &&
        patient.phoneNumber.toLowerCase().includes(searchLower)) ||
      (patient.address && patient.address.toLowerCase().includes(searchLower))
    );
  });

  // Loading state with skeleton
  if (isLoading) {
    return (
      <Stack>
        <Skeleton height={40} radius="sm" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} height={50} radius="sm" mt="sm" />
        ))}
      </Stack>
    );
  }

  return (
    <Table highlightOnHover verticalSpacing="sm" horizontalSpacing="lg">
      <Table.Thead>
        <Table.Tr>
          <Table.Th c="dimmed">Name</Table.Th>
          <Table.Th c="dimmed">Email</Table.Th>
          <Table.Th c="dimmed">Phone</Table.Th>
          <Table.Th c="dimmed">Status</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {filteredPatients.length === 0 ? (
          <Table.Tr>
            <Table.Td colSpan={4}>
              <Center py="xl">
                <Stack align="center" gap="md">
                  <IconUserOff size={30} opacity={0.4} />
                  <Text size="sm" c="dimmed">
                    {patients.length === 0
                      ? "No patients found"
                      : "No patients match your search"}
                  </Text>
                </Stack>
              </Center>
            </Table.Td>
          </Table.Tr>
        ) : (
          filteredPatients.map((patient) => (
            <Table.Tr
              key={patient.id}
              style={{ cursor: "pointer" }}
              onClick={() => handlePatientClick(patient.id)}
            >
              <Table.Td>
                <Group gap="sm">
                  <Avatar
                    color="#e7edf6"
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePatientClick(patient.id)}
                    size="md"
                    radius="xl"
                    variant="filled"
                  >
                    <Text fz="sm">
                      {getUserInitials({ fullName: patient.fullName })}
                    </Text>
                  </Avatar>
                  <Text
                    size="sm"
                    fw={600}
                    style={{ cursor: "pointer" }}
                    onClick={() => handlePatientClick(patient.id)}
                  >
                    {patient.fullName}
                  </Text>
                </Group>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {patient.email}
                </Text>
              </Table.Td>
              <Table.Td>
                <Text size="sm" c="dimmed">
                  {patient.phoneNumber || "N/A"}
                </Text>
              </Table.Td>
              <Table.Td>
                <Group
                  gap="xs"
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Switch
                    checked={!patient.isBanned}
                    onChange={() =>
                      handleStatusToggle(patient.id, patient.isBanned)
                    }
                    color="green"
                    size="sm"
                  />
                  <Text size="xs" c={patient.isBanned ? "red" : "dimmed"}>
                    {patient.isBanned ? "Banned" : "Active"}
                  </Text>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))
        )}
      </Table.Tbody>
    </Table>
  );
}
