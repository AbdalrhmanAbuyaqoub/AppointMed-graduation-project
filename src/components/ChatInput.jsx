import React, { useState } from "react";
import { TextInput, Button, Group, Tooltip } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import styles from "../styles/Chat.module.css";

export function ChatInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Group gap="xs" className={styles.inputContainer}>
      <TextInput
        placeholder="Type a message... (Press Enter to send)"
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        style={{ flex: 1 }}
        classNames={{ input: styles.input }}
        size="md"
        radius="xl"
      />
      <Tooltip label="Send message" position="top">
        <Button
          onClick={handleSend}
          variant="filled"
          className={styles.sendButton}
          disabled={!newMessage.trim()}
        >
          <IconSend size={18} />
        </Button>
      </Tooltip>
    </Group>
  );
}
