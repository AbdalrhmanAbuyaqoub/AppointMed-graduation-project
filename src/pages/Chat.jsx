import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Stack,
  AppShell,
  Container,
  Paper,
  ScrollArea,
  Group,
  Flex,
  Image,
  Box,
  createTheme,
  MantineProvider,
} from '@mantine/core';
import { ProfileMenu } from '../components/ProfileMenu';
import { MessageBubble } from '../components/MessageBubble';
import { ChatInput } from '../components/ChatInput';
import { IconSettings, IconUser, IconLogout } from '@tabler/icons-react';
import { useAuthentication } from '../hooks/useAuthentication';
import calendarIllustration from '../assets/calendar-illustration.svg';

function Chat() {
  const messagesEndRef = useRef(null);
  const messageIdCounter = useRef(3);
  const { user, handleLogout } = useAuthentication();
  const viewport = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const menuItems = [
    {
      label: 'Profile',
      icon: <IconUser size={14} />,
      onClick: () => {},
    },
    {
      label: 'Settings',
      icon: <IconSettings size={14} />,
      onClick: () => {},
    },
    {
      label: 'Log Out',
      icon: <IconLogout size={14} />,
      onClick: handleLogout,
      color: 'red',
    },
  ];

  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Hi team 👋',
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: '2',
      text: 'Anyone up for lunch today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const scrollToBottom = (behavior = 'smooth') => {
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

  useEffect(() => {
    if (!isScrolling) {
      scrollToBottom();
    }
  }, [messages, isScrolling]);

  const generateMessageId = () => {
    const id = messageIdCounter.current;
    messageIdCounter.current += 1;
    return id.toString();
  };

  const handleSendMessage = useCallback(text => {
    const newUserMessage = {
      id: generateMessageId(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newUserMessage]);
    setIsScrolling(false);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: generateMessageId(),
        text: "Let me know what you'd like to do!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  }, []);

  const handleScroll = event => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
    setIsScrolling(!isAtBottom);
  };

  return (
    <AppShell bg="var(--mantine-color-blue-light)">
      <Flex h="100vh" gap="md" p="md">
        {/* Left side illustration */}
        <Paper w="70%" radius="md" bg="transparent" pos="relative">
          <Box pos="absolute" top={20} left={30}>
            <ProfileMenu
              userRole={user?.role || 'user'}
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
        <Paper w={500} radius="lg" shadow="md" mr={30} bg={'gray.1'}>
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
                {messages.map(message => (
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
