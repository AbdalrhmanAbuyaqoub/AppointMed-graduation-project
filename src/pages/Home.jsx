import {
  Container,
  Title,
  Text,
  Group,
  Button,
  TextInput,
  Table,
  Avatar,
  Badge,
  ActionIcon,
  Stack,
  Select,
  Card,
  Pagination,
  Skeleton,
  Tooltip,
  rem,
} from "@mantine/core";
import {
  IconPlus,
  IconSearch,
  IconFilter,
  IconMessage,
  IconPhone,
  IconMail,
  IconCalendarEvent,
} from "@tabler/icons-react";
import { useState } from "react";
import classes from "./Home.module.css";

// Mock data for appointments
const mockAppointments = [
  {
    id: "01",
    code: "#FUP12131424",
    patient: {
      name: "Isagi Yoichi",
      avatar: "https://i.pravatar.cc/150?img=1",
    },
    createdDate: "03 May 2023",
    time: "10:00 am",
    status: "Completed",
  },
  {
    id: "02",
    code: "#ECC12131424",
    patient: {
      name: "Nagi Seishiro",
      avatar: "https://i.pravatar.cc/150?img=2",
    },
    createdDate: "05 May 2023",
    time: "08:30 am",
    status: "Completed",
  },
  {
    id: "03",
    code: "#FUPECG31424",
    patient: {
      name: "Peter Orman",
      avatar: "https://i.pravatar.cc/150?img=3",
    },
    createdDate: "05 May 2023",
    time: "11:30 am",
    status: "Completed",
  },
  {
    id: "04",
    code: "#FUPECG31424",
    patient: {
      name: "Viony Naila",
      avatar: "https://i.pravatar.cc/150?img=4",
    },
    createdDate: "07 May 2023",
    time: "09:00 am",
    status: "Today",
  },
];

function Home() {
  const [searchValue, setSearchValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "green";
      case "Today":
        return "yellow";
      case "Progress":
        return "blue";
      default:
        return "gray";
    }
  };

  return (
    <Container size="100%" p={rem(8)} mx={100}>
      <Stack gap={rem(24)} mb="xl">
        <Group align="center" gap="xs" pl={rem(8)}>
          <IconCalendarEvent size={32} stroke={1.5} />
          <div>
            <Title order={2}>Appointments</Title>
            <Text size="sm" c="dimmed">
              Latest updates for the last 7 days
            </Text>
          </div>
        </Group>
      </Stack>

      <Card
        shadow="0 4px 12px rgba(0, 0, 0, 0.15)"
        // shadow="md"
        p="lg"
        radius="md"
        withBorder
      >
        <Group justify="flex-end" mb="lg">
          <Button
            leftSection={<IconPlus size={16} />}
            variant="filled"
            radius="md"
            size="md"
          >
            New Appointment
          </Button>
        </Group>

        <Card radius="md" withBorder mb="md" shadow="sm">
          <Group justify="space-between" p="md">
            <Select
              radius="md"
              defaultValue="all"
              data={[
                { value: "all", label: "All Appointments" },
                { value: "today", label: "Today" },
                { value: "upcoming", label: "Upcoming" },
                { value: "completed", label: "Completed" },
              ]}
              style={{ width: 200 }}
            />
            <Group>
              <TextInput
                radius="md"
                placeholder="Search appointments..."
                value={searchValue}
                onChange={(event) => setSearchValue(event.currentTarget.value)}
                leftSection={<IconSearch size={16} />}
                style={{ width: 280 }}
                classNames={{ input: classes.searchInput }}
              />
              <Button
                radius="md"
                variant="light"
                leftSection={<IconFilter size={16} />}
                color="gray"
              >
                Filters
              </Button>
            </Group>
          </Group>
        </Card>

        <Table.ScrollContainer>
          <Table
            verticalSpacing="xs"
            horizontalSpacing="xs"
            highlightOnHover
            w="100%"
          >
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Patient Name</Table.Th>
                <Table.Th>Created Date</Table.Th>
                <Table.Th>Time</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Action</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <Table.Tr key={`skeleton-${index}`}>
                        {Array(5)
                          .fill(0)
                          .map((_, cellIndex) => (
                            <Table.Td key={`cell-${cellIndex}`}>
                              <Skeleton height={20} radius="sm" />
                            </Table.Td>
                          ))}
                      </Table.Tr>
                    ))
                : mockAppointments.map((appointment) => (
                    <Table.Tr key={appointment.id} className={classes.tableRow}>
                      <Table.Td>
                        <Group gap="sm">
                          <Avatar
                            src={appointment.patient.avatar}
                            radius="xl"
                            size="sm"
                            className={classes.avatar}
                          />
                          <Text size="sm" fw={500}>
                            {appointment.patient.name}
                          </Text>
                        </Group>
                      </Table.Td>
                      <Table.Td>{appointment.createdDate}</Table.Td>
                      <Table.Td>{appointment.time}</Table.Td>
                      <Table.Td>
                        <Badge
                          color={getStatusColor(appointment.status)}
                          variant="light"
                          size="lg"
                          radius="sm"
                          className={classes.badge}
                        >
                          {appointment.status}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Group gap="xs">
                          <Tooltip label="Send message">
                            <ActionIcon
                              variant="light"
                              color="teal"
                              size="md"
                              radius="md"
                              className={classes.actionButton}
                            >
                              <IconMessage size={18} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Call patient">
                            <ActionIcon
                              variant="light"
                              color="blue"
                              size="md"
                              radius="md"
                              className={classes.actionButton}
                            >
                              <IconPhone size={18} />
                            </ActionIcon>
                          </Tooltip>
                          <Tooltip label="Send email">
                            <ActionIcon
                              variant="light"
                              color="red"
                              size="md"
                              radius="md"
                              className={classes.actionButton}
                            >
                              <IconMail size={18} />
                            </ActionIcon>
                          </Tooltip>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>

        <Group justify="center" mt="xl">
          <Pagination
            total={10}
            value={currentPage}
            onChange={setCurrentPage}
            radius="md"
          />
        </Group>
      </Card>
    </Container>
  );
}

export default Home;
