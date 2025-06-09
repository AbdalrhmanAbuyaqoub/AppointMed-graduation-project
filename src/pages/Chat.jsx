import React, { useRef, useState } from "react";
import {
  Stack,
  AppShell,
  Paper,
  ScrollArea,
  Group,
  Flex,
  Image,
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { ProfileMenu } from "../components/ProfileMenu";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import { IconSettings, IconUser, IconLogout } from "@tabler/icons-react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useChatQueries } from "../hooks/useChatQueries";
import calendarIllustration from "../assets/calendar-illustration.svg";

function Chat() {
  const viewport = useRef(null);
  const { user, handleLogout } = useAuthentication();
  const [isScrolling, setIsScrolling] = useState(false);
  const { messages, isLoading, sendMessage } = useChatQueries();

  const menuItems = [
    {
      label: "Profile",
      icon: <IconUser size={14} />,
      onClick: () => {},
    },
    {
      label: "Settings",
      icon: <IconSettings size={14} />,
      onClick: () => {},
    },
    {
      label: "Log Out",
      icon: <IconLogout size={14} />,
      onClick: handleLogout,
      color: "red",
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

  return (
    <AppShell bg="var(--mantine-color-blue-light)">
      <Flex h="100vh" gap="md" p="md">
        {/* Left side illustration */}
        <Paper w="70%" radius="md" bg="transparent" pos="relative">
          <Box pos="absolute" top={20} left={30}>
            <ProfileMenu
              userRole={user?.role || "user"}
              menuItems={menuItems}
            />
          </Box>
          <Flex align="center" justify="center" h="100%">
            <Image
              src={calendarIllustration}
              alt="Calendar Illustration"
              h={600}
              w="auto"
            />
          </Flex>
        </Paper>

        {/* Right side chat */}
        <Paper
          w={500}
          radius="lg"
          shadow="md"
          mr={30}
          bg={"gray.1"}
          pos="relative"
        >
          <Flex direction="column" h="100%">
            <ScrollArea
              h="calc(100% - 80px)"
              viewportRef={viewport}
              offsetScrollbars
              onScrollPositionChange={handleScroll}
              scrollbarSize={8}
              type="hover"
            >
              <Stack gap="md" p="md">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </Stack>
            </ScrollArea>
            <ChatInput onSendMessage={handleSendMessage} />
          </Flex>
        </Paper>
      </Flex>
    </AppShell>
  );
}

export default Chat;
