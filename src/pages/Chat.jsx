import React, { useRef, useState } from "react";
import {
  Stack,
  AppShell,
  Paper,
  ScrollArea,
  Group,
  Box,
  LoadingOverlay,
  Container,
  Text,
  Flex,
  Image,
  Center,
} from "@mantine/core";
import { useNavigate, useLocation } from "react-router-dom";
import { ProfileMenu } from "../components/ProfileMenu";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import { ChatContainer } from "../components/ChatContainer";
import { IconSettings, IconUser, IconLogout } from "@tabler/icons-react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useChatQueries } from "../hooks/useChatQueries";
import { ROUTES } from "../routes/index";
import { useMediaQuery } from "@mantine/hooks";
import EventsIllustrationSvg from "../assets/Events-rafiki.svg?react";
import { theme } from "../theme";
import LogoSvg from "../assets/logo.svg?react";

function Chat() {
  const viewport = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, handleLogout } = useAuthentication();
  const [isScrolling, setIsScrolling] = useState(false);
  const { messages, isLoading, sendMessage, clearChat, isClearingChat } =
    useChatQueries();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const showIllustration = useMediaQuery("(min-width: 1200px)");

  // Clear chat when component unmounts (closing chat)
  React.useEffect(() => {
    return () => {
      clearChat();
    };
  }, []);

  const handleLogoutWithClear = async () => {
    await clearChat();
    handleLogout();
  };

  const menuItems = [
    {
      label: "Profile",
      icon: <IconUser size={20} />,
      onClick: () =>
        navigate(ROUTES.PROFILE, { state: { background: location } }),
    },
    // {
    //   label: "Settings",
    //   icon: <IconSettings size={20} />,
    //   onClick: () => {},
    // },
    {
      label: "Log Out",
      icon: <IconLogout size={20} />,
      onClick: handleLogoutWithClear,
    },
  ];

  const scrollToBottom = (behavior = "smooth") => {
    if (viewport.current) {
      const scrollArea = viewport.current;
      const scrollHeight = scrollArea.scrollHeight;
      const clientHeight = scrollArea.clientHeight;

      scrollArea.scrollTo({
        top: scrollHeight - clientHeight,
        behavior,
      });
    }
  };

  React.useEffect(() => {
    if (!isScrolling) {
      scrollToBottom();
    }
  }, [messages, isScrolling]);

  const handleSendMessage = async (text) => {
    if (text.trim()) {
      setIsScrolling(false);
      await sendMessage(text);
    }
  };

  const handleScroll = ({ y }) => {
    if (!viewport.current) return;
    const scrollArea = viewport.current;
    const scrollHeight = scrollArea.scrollHeight;
    const clientHeight = scrollArea.clientHeight;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - y) < 1;
    setIsScrolling(!isAtBottom);
  };

  function illustrationSection() {
    return (
      <Container h="100%">
        <Center h="100%">
          <Stack align="center" gap="xs">
            <EventsIllustrationSvg width={450} height={450} />

            <Text size="xl" fw={600} c="var(--mantine-primary-color-7)">
              Book Your Next Appointment With Us
            </Text>
            <Text size="md" c="dimmed" ta="center" maw={300}>
              Schedule your next visit with our healthcare providers quickly and
              easily.
            </Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  return (
    <AppShell header={{ height: 60 }} padding={0} bg={theme.backgroundColor}>
      <AppShell.Header withBorder={false} bg={theme.backgroundColor}>
        <Container fluid h="100%" maw={1232}>
          <Group p={"xs"} justify="space-between" align="center" h="100%">
            <LogoSvg />
            <ProfileMenu menuItems={menuItems} user={user} />
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main
        style={{
          height: isMobile ? "calc(100vh - 60px)" : "auto",
          overflow: isMobile ? "hidden" : "visible",
        }}
      >
        {isMobile ? (
          <Box style={{ height: "100%", position: "relative" }}>
            <ChatContainer
              messages={messages}
              isClearingChat={isClearingChat}
              viewport={viewport}
              handleScroll={handleScroll}
              handleSendMessage={handleSendMessage}
              isMobile={isMobile}
            />
          </Box>
        ) : (
          <Container h="calc(100vh - 60px)" fluid maw={1232}>
            <Group
              h="100%"
              wrap="nowrap"
              align="stretch"
              justify={showIllustration ? "space-between" : "center"}
            >
              {showIllustration && (
                <Container w={500} h="100%" py="md">
                  {illustrationSection()}
                </Container>
              )}
              <Container w={showIllustration ? 550 : 600} h="100%" py="md">
                <ChatContainer
                  messages={messages}
                  isClearingChat={isClearingChat}
                  viewport={viewport}
                  handleScroll={handleScroll}
                  handleSendMessage={handleSendMessage}
                  isMobile={isMobile}
                />
              </Container>
            </Group>
          </Container>
        )}
      </AppShell.Main>
    </AppShell>
  );
}

export default Chat;
