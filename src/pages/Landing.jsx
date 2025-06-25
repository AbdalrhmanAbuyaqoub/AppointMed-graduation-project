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
  IconRobot,
  IconNetwork,
  IconBulb,
  IconChartBar,
  IconSettings,
  IconUserCheck,
  IconBrandTelegram,
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
      title: "AI-Powered Scheduling Engine",
      description:
        "Advanced Large Language Model with sophisticated NLU capabilities serves as the central reasoning engine, autonomously planning multi-step workflows and executing complex scheduling decisions.",
    },
    {
      icon: IconBrandTelegram,
      title: "Multi-Platform Chat Access",
      description:
        "Patients can access our intelligent scheduling assistant through web interface and Telegram bot, providing 24/7 conversational booking from any platform.",
    },
    {
      icon: IconSettings,
      title: "Complete Administrative Suite",
      description:
        "Comprehensive management interface for manual appointment scheduling, clinic administration, doctor management, and complete operational oversight with powerful staff-friendly tools.",
    },
    {
      icon: IconCalendarEvent,
      title: "Unified Scheduling Dashboard",
      description:
        "Centralized view combining AI-booked and manually scheduled appointments with seamless workflow integration, real-time synchronization, and detailed analytics.",
    },
  ];

  const benefits = [
    "Advanced LLM-powered central reasoning for complex decision-making",
    "Multi-turn conversational AI with sophisticated NLU capabilities",
    "24/7 patient access through web interface and Telegram bot",
    "Multi-platform scheduling availability for maximum patient convenience",
    "Comprehensive administrative interface for manual appointment scheduling",
    "Full clinic and doctor management with staff-friendly tools",
    "Autonomous multi-step workflow planning and execution",
    "Dynamic conflict resolution and intelligent alternative suggestions",
    "Unified dashboard combining automated and manual scheduling",
    "Real-time synchronization between AI bookings and staff management",
    "Complete administrative oversight with detailed reporting and analytics",
    "Seamless integration between automated and manual scheduling workflows",
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
                  radius="md"
                  color={theme.primaryColor}
                  onClick={() => navigate("/login")}
                >
                  Log in
                </Button>
                <Button
                  variant="filled"
                  radius="md"
                  onClick={() => navigate("/register")}
                >
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
                    Next-Generation{" "}
                    <Text
                      component="span"
                      inherit
                      variant="gradient"
                      gradient={{ from: "violet", to: "grape" }}
                    >
                      AI Healthcare Scheduling
                    </Text>
                  </Title>

                  <Text size="xl" c="gray.6" maw={500}>
                    A sophisticated AI-powered appointment management system
                    architected around a Large Language Model that functions as
                    a central reasoning engine. While providing administrative
                    staff with a comprehensive interface for manual schedule
                    management, our core innovation lies in the patient-facing
                    conversational AI that leverages advanced NLU and autonomous
                    tool use to optimize workflows and dramatically reduce
                    administrative burden.
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
                      Start Now
                    </Button>
                  </Group>
                </Stack>
              </Grid.Col>

              <Grid.Col span={{ base: 12, md: 6 }}>
                <Center>
                  <Image
                    src={scheduleIllustration}
                    alt="AI Medical Scheduling"
                    maw={500}
                  />
                </Center>
              </Grid.Col>
            </Grid>
          </Container>

          <Container size="xl" py={80}>
            <Stack align="center" gap="xl" mb={60}>
              <Title order={2} size={36} fw={700} ta="center" c={theme.black}>
                AI Innovation Meets Administrative Excellence
              </Title>
              <Text size="lg" c="gray.6" ta="center" maw={700}>
                Our system combines cutting-edge AI automation with
                comprehensive manual management tools, empowering both patients
                and administrative staff
              </Text>
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
                    Dual-Powered Scheduling Excellence
                  </Title>
                  <Text size="lg" c="gray.6">
                    Our system seamlessly integrates advanced AI automation with
                    comprehensive administrative tools. While patients enjoy
                    intelligent conversational booking with sophisticated NLU
                    and multi-step workflow automation, administrative staff
                    maintain complete control through powerful manual scheduling
                    and management interfaces.
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
                    alt="AI Time Management"
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
                  Transform Healthcare Scheduling with AI
                </Title>
                <Text size="xl" c="white" opacity={0.9} maw={700}>
                  Experience the perfect fusion of intelligent automation and
                  administrative control. Our LLM-powered system doesn't just
                  schedule—it thinks, plans, and optimizes while giving staff
                  complete oversight and management capabilities.
                </Text>
                <Button
                  size="xl"
                  variant="white"
                  c={theme.primaryColor}
                  onClick={() => navigate("/register")}
                  rightSection={<IconArrowRight size={20} />}
                >
                  Start Now
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
