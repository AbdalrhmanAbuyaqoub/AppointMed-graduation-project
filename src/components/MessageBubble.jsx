import React from "react";
import { Avatar, Text, Group, Paper, Stack, Box } from "@mantine/core";
import { IconUser, IconRobot } from "@tabler/icons-react";
import styles from "../styles/Chat.module.css";

export function MessageBubble({ message }) {
  return (
    <Group
      justify={message.isUser ? "flex-end" : "flex-start"}
      align="flex-end"
      className={styles.messageGroup}
    >
      {!message.isUser && (
        <Avatar
          variant="filled"
          radius="xl"
          size="md"
          className={styles.botAvatar}
        >
          <IconRobot size="1.2rem" />
        </Avatar>
      )}
      <Stack
        gap={4}
        align={message.isUser ? "flex-end" : "flex-start"}
        style={{ maxWidth: "70%" }}
      >
        <Box className={styles.messageWrapper}>
          <Paper
            className={message.isUser ? styles.userBubble : styles.botBubble}
            shadow="sm"
            p="sm"
          >
            <Text
              size="sm"
              style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {message.text}
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
          size="md"
          radius="xl"
          className={styles.userAvatar}
        >
          <IconUser size="1.2rem" />
        </Avatar>
      )}
    </Group>
  );
}
