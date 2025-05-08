import React, { useState } from "react";
import { TextInput, Button, Group } from "@mantine/core";
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

  return (
    <Group gap="xs" style={{ padding: "15px 0" }}>
      <TextInput
        placeholder="Type your message..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
        style={{ flex: 1 }}
        classNames={{ input: styles.input }}
      />
      <Button
        onClick={handleSend}
        variant="filled"
        className={styles.sendButton}
      >
        <IconSend size={18} />
      </Button>
    </Group>
  );
}
