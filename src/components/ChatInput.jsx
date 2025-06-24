import React, { useState, useRef, useEffect } from "react";
import { TextInput, Button, Group, Tooltip, ActionIcon } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import styles from "../styles/Chat.module.css";
import { useMediaQuery } from "@mantine/hooks";

export function ChatInput({ onSendMessage }) {
  const [newMessage, setNewMessage] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const inputRef = useRef(null);

  // Keep focus on input after sending message
  useEffect(() => {
    if (isMobile && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMobile]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
      // Immediately focus back on input to keep keyboard open
      if (isMobile && inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 50);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Prevent keyboard from closing on blur
  const handleBlur = (e) => {
    if (isMobile) {
      e.preventDefault();
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <Group gap="xs" h="100%" p={isMobile ? "xs" : "xs"}>
      <TextInput
        size={"md"}
        ref={inputRef}
        placeholder={
          isMobile
            ? "Type a message..."
            : "Type a message... (Press Enter to send)"
        }
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        onBlur={handleBlur}
        autoFocus={isMobile}
        style={{ flex: 1 }}
        radius="xl"
      />
      <Tooltip label="Send message" position="top">
        <ActionIcon
          onClick={handleSend}
          variant="filled"
          size={"xl"}
          radius="xl"
          p={isMobile ? "xs" : "xs"}
        >
          <IconSend size={isMobile ? 20 : 24} />
        </ActionIcon>
      </Tooltip>
    </Group>
  );
}
