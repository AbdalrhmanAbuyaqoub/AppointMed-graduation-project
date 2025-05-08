import React from "react";
import { Avatar, Text, Group, ActionIcon } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";
import styles from "../styles/Chat.module.css";

export function MessageBubble({ message }) {
  return (
    <Group
      justify={message.isUser ? "flex-end" : "flex-start"}
      style={{ width: "100%" }}
    >
      {!message.isUser && (
        <Avatar
          src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png"
          radius="xl"
          size="sm"
        />
      )}
      <div className={message.isUser ? styles.userBubble : styles.botBubble}>
        <Text size="sm" c={message.isUser ? "white" : "#333"}>
          {message.text}
        </Text>
        <Text size="xs" c={message.isUser ? "white" : "#666"} ta="right" mt={4}>
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </div>
      {message.isUser && (
        <ActionIcon
          variant="filled"
          size={32}
          radius="xl"
          className={styles.userAvatar}
        >
          <IconUser size={"18"} />
        </ActionIcon>
      )}
    </Group>
  );
}
