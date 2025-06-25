import {
  Container,
  Title,
  Paper,
  Stack,
  Group,
  Text,
  Badge,
  Grid,
  Divider,
  Avatar,
  Box,
  Center,
  Loader,
  Button,
} from "@mantine/core";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import { useDoctorQueries } from "../hooks/useDoctorQueries";
import { useAllDoctorsWorkingHours } from "../hooks/useWorkingHoursQueries";
import {
  IconCalendar,
  IconStethoscope,
  IconUsers,
  IconPlus,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import CreateAppointmentDrawer from "../components/CreateAppointmentDrawer";
import TodaysAppointmentsTable from "../components/TodaysAppointmentsTable";
import styles from "../styles/Dashboard.module.css";
import { getUserInitials } from "../utils/userUtils";

dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to check if a date is today
const isToday = (date) => {
  const today = dayjs().tz(dayjs.tz.guess()).format("YYYY-MM-DD");
  const appointmentDate = dayjs
    .utc(date)
    .tz(dayjs.tz.guess())
    .format("YYYY-MM-DD");
  return today === appointmentDate;
};

// Helper function to check if a date is upcoming (today or future)
const isUpcoming = (date) => {
  const today = dayjs().tz(dayjs.tz.guess());
  const appointmentDate = dayjs.utc(date).tz(dayjs.tz.guess());
  return appointmentDate.isAfter(today.subtract(1, "day"));
};

// Helper function to get doctors working today
const getDoctorsAvailableToday = (doctors, doctorsWorkingDays) => {
  // Get today's day number (0=Sunday, 1=Monday, etc.)
  const todayDayNumber = dayjs().day();

  // Filter doctors who are working today
  return doctors.filter((doctor) => {
    const workingDays = doctorsWorkingDays[doctor.id] || [];

    // If working days is empty, doctor is available all days
    if (workingDays.length === 0) {
      return true;
    }

    return workingDays.includes(todayDayNumber);
  });
};

function Dashboard() {
  const navigate = useNavigate();
  const { appointments, isLoadingAppointments, appointmentsError } =
    useAppointmentQueries();

  const { doctors, isLoading: isLoadingDoctors } = useDoctorQueries();
  const { doctorsWorkingDays, isLoading: isLoadingWorkingHours } =
    useAllDoctorsWorkingHours();

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  // Format appointments with proper date handling
  const formattedAppointments = (appointments || []).map((appointment) => {
    const startDate = appointment.startDate
      ? dayjs.utc(appointment.startDate).tz(dayjs.tz.guess())
      : null;

    return {
      ...appointment,
      formattedStartDate: startDate,
      doctorName: appointment.doctor?.name || "N/A",
      displayDate: startDate?.format("MMM D, YYYY") || "Invalid Date",
      displayTime: startDate?.format("hh:mm A") || "Invalid Time",
    };
  });

  // Filter today's appointments
  const todaysAppointments = formattedAppointments.filter(
    (appointment) =>
      appointment.formattedStartDate && isToday(appointment.startDate)
  );

  // Filter today's upcoming appointments and sort by time
  const upcomingAppointments = formattedAppointments
    .filter(
      (appointment) =>
        appointment.formattedStartDate && isToday(appointment.startDate)
    )
    .sort((a, b) => {
      if (!a.formattedStartDate || !b.formattedStartDate) return 0;
      return a.formattedStartDate.isBefore(b.formattedStartDate) ? -1 : 1;
    });

  // Get doctors available today
  const doctorsAvailableToday = getDoctorsAvailableToday(
    doctors,
    doctorsWorkingDays
  );

  if (isLoadingAppointments || isLoadingDoctors || isLoadingWorkingHours) {
    return (
      <Container pt={12} fluid maw={1232}>
        <Center h={400}>
          <Stack align="center">
            <Loader size="lg" />
            <Text>Loading dashboard...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  if (appointmentsError) {
    return (
      <Container pt={12} fluid maw={1232}>
        <Text color="red">
          Error loading dashboard: {appointmentsError.message}
        </Text>
      </Container>
    );
  }

  return (
    <Container pt={12} fluid maw={1232} h="200">
      <Stack>
        <Title fz={"24px"} order={2}>
          Dashboard
        </Title>
        {/* main grid */}
        <Grid gutter="md" w={"100%"}>
          {/* left section - statistics */}

          <Grid.Col span={8}>
            <Stack>
              <Group justify="space-between" gap="md" w={"100%"}>
                <Paper
                  withBorder
                  radius="md"
                  p="md"
                  h={100}
                  style={{ flex: 1 }}
                >
                  <Group justify="space-between" align="center" h="100%">
                    <Stack gap="xs">
                      <Group gap="xs">
                        <IconCalendar
                          size={20}
                          color="var(--mantine-color-green-6)"
                        />
                        <Title order={3} fz="16px" c="dimmed">
                          Today's Appointments
                        </Title>
                      </Group>
                      <Text fz="24px" fw={700} c="green">
                        {todaysAppointments.length}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
                <Paper
                  withBorder
                  radius="md"
                  p="md"
                  h={100}
                  style={{ flex: 1 }}
                >
                  <Group justify="space-between" align="center" h="100%">
                    <Stack gap="xs">
                      <Group gap="xs">
                        <IconCalendar
                          size={20}
                          color="var(--mantine-color-blue-6)"
                        />
                        <Title order={3} fz="16px" c="dimmed">
                          Total Appointments
                        </Title>
                      </Group>
                      <Text fz="24px" fw={700} c="blue">
                        {formattedAppointments.length}
                      </Text>
                    </Stack>
                  </Group>
                </Paper>
              </Group>

              {/* left section - upcoming appointments */}
              <Paper withBorder radius="md" p="md" h={500}>
                <Group justify="space-between" align="center" mb="md">
                  <Group>
                    {/* <IconCalendar size={20} /> */}
                    <Title order={3} fz="18px">
                      Upcoming Appointments
                    </Title>
                  </Group>
                  <Button
                    onClick={openDrawer}
                    leftSection={<IconPlus size={16} />}
                    variant="outline"
                    size="md"
                    radius="xl"
                    fw={500}
                  >
                    New Appointment
                  </Button>
                </Group>

                <Box
                  style={{
                    overflowY: "auto",
                    height: "calc(100% - 60px)",
                  }}
                  className={styles.autoHideScrollbar}
                >
                  <TodaysAppointmentsTable
                    appointments={upcomingAppointments}
                  />
                </Box>
              </Paper>
            </Stack>
          </Grid.Col>

          {/* right section - doctors */}
          <Grid.Col span={4}>
            <Paper withBorder radius="md" p="md" h={616}>
              <Group mb="xs">
                {/* <IconUsers size={20} color="var(--mantine-color-green-6)" /> */}
                <Title order={4} fz="lg">
                  Available Doctors
                </Title>
              </Group>

              <Stack
                gap="sm"
                style={{ overflowY: "auto", height: "calc(100% - 40px)" }}
                className={styles.autoHideScrollbar}
              >
                {doctorsAvailableToday.map((doctor) => (
                  <Group
                    style={{
                      cursor: "pointer",
                      padding: "8px",
                      borderRadius: "8px",
                      transition: "background-color 0.2s ease",
                    }}
                    key={doctor.id}
                    gap="xs"
                    onClick={() => handleDoctorClick(doctor.id)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "var(--mantine-color-gray-1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                    }}
                  >
                    <Avatar
                      color="#e7edf6"
                      style={{ cursor: "pointer" }}
                      size="md"
                      radius="xl"
                      variant="filled"
                    >
                      <Text fz="sm">
                        {getUserInitials({ fullName: doctor.name })}
                      </Text>
                    </Avatar>
                    <Stack gap="0">
                      <Text fw={500} truncate>
                        Dr. {doctor.name}
                      </Text>
                      <Text size="sm" c="dimmed" truncate>
                        {doctor.clinicName}
                      </Text>
                    </Stack>
                  </Group>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
        </Grid>

        <CreateAppointmentDrawer opened={drawerOpened} onClose={closeDrawer} />
      </Stack>
    </Container>
  );
}

export default Dashboard;
