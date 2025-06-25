import React from "react";
import { Avatar, Text, Group, Paper, Stack, Box } from "@mantine/core";
import { IconRobot } from "@tabler/icons-react";
import styles from "../styles/Chat.module.css";
import { useMediaQuery } from "@mantine/hooks";
import { useAuthentication } from "../hooks/useAuthentication";
import { getUserInitials } from "../utils/userUtils";

// Helper to detect Arabic text
function isArabicText(text) {
  const arabicPattern = /[\u0600-\u06FF]/;
  return arabicPattern.test(text);
}

// Helper to manually parse <b> tags
function parseBold(text) {
  const parts = [];
  let lastIndex = 0;
  const regex = /<b>(.*?)<\/b>/gi;
  let match;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(<b key={key++}>{match[1]}</b>);
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export function MessageBubble({ message }) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isArabic = isArabicText(message.text);
  const { user } = useAuthentication();

  return (
    <Group
      justify={message.isUser ? "flex-end" : "flex-start"}
      align="flex-end"
      className={styles.messageGroup}
      gap={isMobile ? "xs" : "md"}
    >
      {!message.isUser && (
        <Avatar
          variant="filled"
          radius="xl"
          size={isMobile ? "sm" : "md"}
          className={styles.botAvatar}
        >
          <IconRobot size={isMobile ? "1rem" : "1.2rem"} />
        </Avatar>
      )}
      <Stack
        gap={2}
        align={message.isUser ? "flex-end" : "flex-start"}
        style={{ maxWidth: isMobile ? "85%" : "70%" }}
      >
        <Box className={styles.messageWrapper}>
          <Paper
            className={message.isUser ? styles.userBubble : styles.botBubble}
            shadow="sm"
            p={isMobile ? "xs" : "sm"}
          >
            <Text
              c={message.isUser ? "white" : "black"}
              size={isMobile ? "sm" : "md"}
              style={{
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                direction: isArabic ? "rtl" : "ltr",
                textAlign: isArabic ? "right" : "left",
              }}
            >
              {parseBold(message.text)}
            </Text>
          </Paper>
        </Box>
        <Text size="xs" c="dimmed" className={styles.timestamp}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </Stack>
      {message.isUser && (
        <Avatar
          variant="filled"
          color="gray.3"
          size={isMobile ? "sm" : "md"}
          radius="xl"
          className={styles.userAvatar}
        >
          <Text>
            {getUserInitials({
              firstName: user?.firstName,
              lastName: user?.lastName,
            })}
          </Text>
        </Avatar>
      )}
    </Group>
  );
}
