// import {
//   Title,
//   Text,
//   Button,
//   Container,
//   Group,
//   Stack,
//   Box,
//   Paper,
//   Grid,
//   Center,
//   Divider,
//   Card,
//   SimpleGrid,
//   Image,
//   Badge,
//   Anchor,
//   Space,
// } from "@mantine/core";
// import {
//   IconCalendarEvent,
//   IconUsers,
//   IconBuildingHospital,
//   IconStethoscope,
//   IconClock,
//   IconShield,
//   IconArrowRight,
//   IconCheck,
// } from "@tabler/icons-react";
// import { useNavigate } from "react-router-dom";
// import scheduleIllustration from "../assets/Schedule-amico.svg";
// import timeManagementIllustration from "../assets/Time management-pana.svg";
// import prescriptionIllustration from "../assets/Medical prescription-amico.svg";
// import eventsIllustration from "../assets/Events-rafiki.svg";
// import { Logo } from "../components/Logo";
// import { theme } from "../theme";

// export default function Landing() {
//   const navigate = useNavigate();

//   const features = [
//     {
//       icon: IconCalendarEvent,
//       title: "Smart Scheduling",
//       description:
//         "Intelligent appointment booking with automated reminders and conflict prevention.",
//       illustration: scheduleIllustration,
//     },
//     {
//       icon: IconUsers,
//       title: "Patient Management",
//       description:
//         "Comprehensive patient records and history tracking in one secure platform.",
//       illustration: prescriptionIllustration,
//     },
//     {
//       icon: IconBuildingHospital,
//       title: "Multi-Clinic Support",
//       description:
//         "Manage multiple clinic locations with centralized oversight and reporting.",
//       illustration: eventsIllustration,
//     },
//     {
//       icon: IconStethoscope,
//       title: "Doctor Portal",
//       description:
//         "Dedicated portal for healthcare professionals with specialized tools.",
//       illustration: timeManagementIllustration,
//     },
//   ];

//   const stats = [
//     { label: "Active Clinics", value: "500+", icon: IconBuildingHospital },
//     {
//       label: "Healthcare Professionals",
//       value: "2000+",
//       icon: IconStethoscope,
//     },
//     { label: "Appointments Managed", value: "50K+", icon: IconCalendarEvent },
//     { label: "Uptime Guarantee", value: "99.9%", icon: IconShield },
//   ];

//   const benefits = [
//     "Reduce appointment scheduling conflicts",
//     "Streamline patient check-in process",
//     "Automated appointment reminders",
//     "Comprehensive reporting and analytics",
//     "HIPAA compliant data security",
//     "24/7 technical support",
//   ];

//   return (
//     <Box bg={theme.backgroundColor} mih="100vh">
//       {/* Navigation Header */}
//       <Paper
//         shadow="xs"
//         withBorder={false}
//         bg="white"
//         pos="sticky"
//         top={0}
//         style={{ zIndex: 100 }}
//       >
//         <Container size="xl" py="md">
//           <Group justify="space-between" align="center">
//             <Logo />
//             <Group gap="md">
//               <Button
//                 variant="subtle"
//                 color={theme.primaryColor}
//                 size="md"
//                 onClick={() => navigate("/login")}
//                 radius="md"
//               >
//                 Log in
//               </Button>
//               <Button
//                 variant="gradient"
//                 gradient={{ from: "violet", to: "grape" }}
//                 size="md"
//                 onClick={() => navigate("/login?register=true")}
//                 radius="md"
//                 rightSection={<IconArrowRight size={16} />}
//               >
//                 Sign up
//               </Button>
//             </Group>
//           </Group>
//         </Container>
//       </Paper>

//       {/* Hero Section */}
//       <Container size="xl" py={80}>
//         <Grid align="center" gutter={60}>
//           <Grid.Col span={{ base: 12, md: 6 }}>
//             <Stack gap="xl">
//               <Badge
//                 variant="light"
//                 color={theme.primaryColor}
//                 size="lg"
//                 radius="md"
//                 leftSection={<IconShield size={16} />}
//               >
//                 HIPAA Compliant Platform
//               </Badge>

//               <Title
//                 order={1}
//                 size={56}
//                 fw={800}
//                 lh={1.2}
//                 c={theme.black}
//                 style={{ fontFamily: theme.headings.fontFamily }}
//               >
//                 Streamline Your{" "}
//                 <Text
//                   component="span"
//                   inherit
//                   variant="gradient"
//                   gradient={{ from: "violet", to: "grape" }}
//                 >
//                   Medical Practice
//                 </Text>{" "}
//                 with Smart Scheduling
//               </Title>

//               <Text size="xl" c="gray.6" lh={1.6} maw={500}>
//                 Manage appointments, patient records, and clinic operations all
//                 in one comprehensive platform. Built for healthcare
//                 professionals who value efficiency and patient care.
//               </Text>

//               <Group gap="lg">
//                 <Button
//                   size="xl"
//                   variant="gradient"
//                   gradient={{ from: "violet", to: "grape" }}
//                   onClick={() => navigate("/login?register=true")}
//                   radius="md"
//                   rightSection={<IconArrowRight size={20} />}
//                 >
//                   Get Started Free
//                 </Button>
//                 <Button
//                   size="xl"
//                   variant="outline"
//                   color={theme.primaryColor}
//                   onClick={() => navigate("/login")}
//                   radius="md"
//                 >
//                   View Demo
//                 </Button>
//               </Group>
//             </Stack>
//           </Grid.Col>

//           <Grid.Col span={{ base: 12, md: 6 }}>
//             <Center>
//               <Image
//                 src={scheduleIllustration}
//                 alt="Medical Scheduling Illustration"
//                 maw={500}
//                 h="auto"
//               />
//             </Center>
//           </Grid.Col>
//         </Grid>
//       </Container>

//       {/* Stats Section */}
//       <Container size="xl" py={60}>
//         <Paper shadow="sm" radius="lg" p="xl" bg="white">
//           <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="xl">
//             {stats.map((stat, index) => (
//               <Center key={index}>
//                 <Stack gap="xs" align="center">
//                   <Box
//                     w={60}
//                     h={60}
//                     bg="linear-gradient(135deg, #7C3AED, #A78BFA)"
//                     style={{
//                       borderRadius: 12,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <stat.icon size={24} color="white" />
//                   </Box>
//                   <Text fw={700} size="xl" c={theme.primaryColor}>
//                     {stat.value}
//                   </Text>
//                   <Text size="sm" c="dimmed" ta="center">
//                     {stat.label}
//                   </Text>
//                 </Stack>
//               </Center>
//             ))}
//           </SimpleGrid>
//         </Paper>
//       </Container>

//       {/* Features Section */}
//       <Container size="xl" py={80}>
//         <Stack align="center" gap="xl" mb={60}>
//           <Title
//             order={2}
//             size={36}
//             fw={700}
//             ta="center"
//             c={theme.black}
//             maw={600}
//           >
//             Everything you need to manage your medical practice
//           </Title>
//           <Text size="lg" ta="center" c="gray.6" maw={600}>
//             Our comprehensive platform provides all the tools healthcare
//             professionals need to deliver exceptional patient care while
//             maintaining operational efficiency.
//           </Text>
//         </Stack>

//         <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
//           {features.map((feature, index) => (
//             <Card key={index} shadow="sm" radius="lg" p="xl" withBorder>
//               <Stack gap="md" align="center" ta="center">
//                 <Box
//                   w={80}
//                   h={80}
//                   bg="linear-gradient(135deg, #7C3AED, #A78BFA)"
//                   style={{
//                     borderRadius: 16,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <feature.icon size={32} color="white" />
//                 </Box>
//                 <Title order={3} size={18} fw={600} c={theme.black}>
//                   {feature.title}
//                 </Title>
//                 <Text c="dimmed" size="sm" lh={1.5}>
//                   {feature.description}
//                 </Text>
//               </Stack>
//             </Card>
//           ))}
//         </SimpleGrid>
//       </Container>

//       {/* Benefits Section */}
//       <Container size="xl" py={80}>
//         <Grid align="center" gutter={60}>
//           <Grid.Col span={{ base: 12, md: 6 }}>
//             <Stack gap="xl">
//               <Title order={2} size={32} fw={700} c={theme.black}>
//                 Why Healthcare Professionals Choose AppointMed
//               </Title>
//               <Text size="lg" c="gray.6" lh={1.6}>
//                 Join thousands of healthcare professionals who have transformed
//                 their practice management with our comprehensive platform.
//               </Text>

//               <Stack gap="md">
//                 {benefits.map((benefit, index) => (
//                   <Group key={index} gap="md">
//                     <Box
//                       w={24}
//                       h={24}
//                       bg={theme.primaryColor}
//                       style={{
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       <IconCheck size={14} color="white" />
//                     </Box>
//                     <Text size="md" c={theme.black}>
//                       {benefit}
//                     </Text>
//                   </Group>
//                 ))}
//               </Stack>
//             </Stack>
//           </Grid.Col>

//           <Grid.Col span={{ base: 12, md: 6 }}>
//             <Center>
//               <Image
//                 src={timeManagementIllustration}
//                 alt="Time Management Illustration"
//                 maw={400}
//                 h="auto"
//               />
//             </Center>
//           </Grid.Col>
//         </Grid>
//       </Container>

//       {/* Call to Action */}
//       <Box bg="linear-gradient(135deg, #7C3AED, #A78BFA)" py={80}>
//         <Container size="xl">
//           <Stack align="center" gap="xl" ta="center">
//             <Title order={2} size={36} fw={700} c="white" maw={600}>
//               Ready to transform your medical practice?
//             </Title>
//             <Text size="xl" c="white" opacity={0.9} maw={500} lh={1.6}>
//               Join thousands of healthcare professionals who trust AppointMed
//               for their daily operations. Start your free trial today.
//             </Text>
//             <Group gap="lg">
//               <Button
//                 size="xl"
//                 variant="white"
//                 c={theme.primaryColor}
//                 onClick={() => navigate("/login?register=true")}
//                 radius="md"
//                 rightSection={<IconArrowRight size={20} />}
//               >
//                 Start Your Free Trial
//               </Button>
//               <Button
//                 size="xl"
//                 variant="outline"
//                 c="white"
//                 onClick={() => navigate("/login")}
//                 radius="md"
//                 style={{ borderColor: "white" }}
//               >
//                 Contact Sales
//               </Button>
//             </Group>
//           </Stack>
//         </Container>
//       </Box>

//       {/* Footer */}
//       <Paper bg="white" py="xl" mt={0}>
//         <Container size="xl">
//           <Divider mb="xl" />
//           <Group justify="space-between" align="center">
//             <Logo />
//             <Group gap="xl">
//               <Anchor
//                 href="#"
//                 c="gray.6"
//                 size="sm"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   navigate("/login");
//                 }}
//               >
//                 Privacy Policy
//               </Anchor>
//               <Anchor
//                 href="#"
//                 c="gray.6"
//                 size="sm"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   navigate("/login");
//                 }}
//               >
//                 Terms of Service
//               </Anchor>
//               <Anchor
//                 href="#"
//                 c="gray.6"
//                 size="sm"
//                 onClick={(e) => {
//                   e.preventDefault();
//                   navigate("/login");
//                 }}
//               >
//                 Support
//               </Anchor>
//             </Group>
//           </Group>
//           <Space h="md" />
//           <Text ta="center" c="gray.5" size="sm">
//             © 2024 AppointMed. All rights reserved.
//           </Text>
//         </Container>
//       </Paper>
//     </Box>
//   );
// }

import {
  Title,
  Text,
  Button,
  Container,
  Group,
  Stack,
  Box,
  Grid,
  Center,
  Card,
  SimpleGrid,
  Image,
  AppShell,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconUsers,
  IconBuildingHospital,
  IconStethoscope,
  IconMessageChatbot,
  IconBrain,
  IconShield,
  IconArrowRight,
  IconCheck,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import scheduleIllustration from "../assets/Schedule-amico.svg";
import timeManagementIllustration from "../assets/Time management-pana.svg";
import LogoSvg from "../assets/logo.svg?react";
import { theme } from "../theme";

export default function Landing() {
  const navigate = useNavigate();

  const features = [
    {
      icon: IconMessageChatbot,
      title: "AI Chatbot Booking",
      description:
        "Patients book appointments via smart chatbot on web or Telegram.",
    },
    {
      icon: IconBrain,
      title: "AI Appointment System",
      description:
        "AI-powered engine for smart scheduling, conflict resolution, and optimization.",
    },
    {
      icon: IconBuildingHospital,
      title: "Clinic & Doctor Management",
      description:
        "Add, manage, and organize clinics and healthcare providers easily.",
    },
    {
      icon: IconCalendarEvent,
      title: "Centralized Dashboard",
      description:
        "Unified view of all appointments whether booked manually or via chatbot.",
    },
  ];

  const stats = [
    { label: "Integrated Clinics", value: "30+", icon: IconBuildingHospital },
    { label: "Doctors Managed", value: "100+", icon: IconStethoscope },
    { label: "Appointments Booked", value: "15K+", icon: IconCalendarEvent },
    { label: "AI Scheduling Accuracy", value: "98%", icon: IconShield },
  ];

  const benefits = [
    "24/7 automated patient booking via chatbot",
    "Admin-friendly clinic and doctor setup",
    "Real-time appointment syncing",
    "Reduced no-shows with reminders",
  ];

  return (
    <Box bg={theme.backgroundColor} mih="100vh">
      <AppShell header={{ height: 70 }} withBorder={false}>
        <AppShell.Header bg="white" style={{ boxShadow: theme.shadows.xs }}>
          <Container size="xl" h="100%">
            <Group justify="space-between" align="center" h="100%">
              <LogoSvg />
              <Group gap="md">
                <Button
                  variant="subtle"
                  color={theme.primaryColor}
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
                <Button variant="filled" onClick={() => navigate("/register")}>
                  Sign up
                </Button>
              </Group>
            </Group>
          </Container>
        </AppShell.Header>

        <AppShell.Main bg={theme.backgroundColor}>
          <Container size="xl" py={80}>
            <Grid align="center" gutter={60}>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xl">
                  <Title order={1} size={56} fw={800} c={theme.black}>
                    Revolutionize Your{" "}
                    <Text
                      component="span"
                      inherit
                      variant="gradient"
                      gradient={{ from: "violet", to: "grape" }}
                    >
                      Healthcare Scheduling
                    </Text>
                  </Title>

                  <Text size="xl" c="gray.6" maw={500}>
                    A modern platform for medical centers to manage
                    appointments, clinics, doctors, and patients. Powered by AI
                    and chatbot integrations.
                  </Text>

                  <Group>
                    <Button
                      size="xl"
                      variant="gradient"
                      gradient={{ from: "violet", to: "grape" }}
                      onClick={() => navigate("/register")}
                      radius="md"
                      rightSection={<IconArrowRight size={20} />}
                    >
                      Get Started Free
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Center>
                  <Image
                    src={scheduleIllustration}
                    alt="Medical Scheduling"
                    maw={500}
                  />
                </Center>
              </Grid.Col>
            </Grid>
          </Container>

          <Container size="xl" py={80}>
            <Stack align="center" gap="xl" mb={60}>
              <Title order={2} size={36} fw={700} ta="center" c={theme.black}>
                Built to empower clinics, doctors, and patients
              </Title>
            </Stack>

            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
              {features.map((feature, index) => (
                <Card key={index} shadow="sm" p="xl" withBorder>
                  <Stack gap="md" align="center" ta="center">
                    <Box
                      w={60}
                      h={60}
                      bg="linear-gradient(135deg, #7C3AED, #A78BFA)"
                      style={{
                        borderRadius: 12,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <feature.icon size={24} color="white" />
                    </Box>
                    <Title order={3} size={18} fw={600}>
                      {feature.title}
                    </Title>
                    <Text c="dimmed" size="sm">
                      {feature.description}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Container>

          <Container size="xl" py={80}>
            <Grid align="center" gutter={60}>
              <Grid.Col span={{ base: 12, md: 6 }}>
                <Stack gap="xl">
                  <Title order={2} size={32} fw={700} c={theme.black}>
                    Why Choose AppointMed
                  </Title>
                  <Text size="lg" c="gray.6">
                    Our AI-assisted chatbot and admin tools streamline clinic
                    operations and give patients the freedom to book anytime,
                    anywhere.
                  </Text>

                  <Stack gap="md">
                    {benefits.map((benefit, index) => (
                      <Group key={index} gap="md">
                        <Box
                          w={20}
                          h={20}
                          bg={theme.primaryColor}
                          style={{
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <IconCheck size={12} color="white" />
                        </Box>
                        <Text>{benefit}</Text>
                      </Group>
                    ))}
                  </Stack>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Center>
                  <Image
                    src={timeManagementIllustration}
                    alt="Time Management"
                    maw={400}
                  />
                </Center>
              </Grid.Col>
            </Grid>
          </Container>

          <Box bg="linear-gradient(135deg, #7C3AED, #A78BFA)" py={80}>
            <Container size="xl">
              <Stack align="center" gap="xl" ta="center">
                <Title order={2} size={36} fw={700} c="white">
                  Start simplifying your healthcare workflow
                </Title>
                <Text size="xl" c="white" opacity={0.9} maw={500}>
                  Automate, manage, and scale your medical center with
                  AppointMed. Bookings have never been smarter.
                </Text>
                <Button
                  size="xl"
                  variant="white"
                  c={theme.primaryColor}
                  onClick={() => navigate("/register")}
                  rightSection={<IconArrowRight size={20} />}
                >
                  Try AppointMed Now
                </Button>
              </Stack>
            </Container>
          </Box>
        </AppShell.Main>
      </AppShell>

      <Box
        bg="white"
        py="xl"
        style={{
          borderTop: `1px solid ${theme.colors?.gray?.[2] || "#e9ecef"}`,
        }}
      >
        <Container size="xl">
          <Group justify="space-between" align="center">
            <LogoSvg />
            <Text c="gray.5" size="sm">
              © 2025 AppointMed. All rights reserved.
            </Text>
          </Group>
        </Container>
      </Box>
    </Box>
  );
}
