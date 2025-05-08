import React, { useState, useCallback } from "react";
import { Stack } from "@mantine/core";
import { ProfileMenu } from "../components/ProfileMenu";
import { MessageBubble } from "../components/MessageBubble";
import { ChatInput } from "../components/ChatInput";
import styles from "../styles/Chat.module.css";

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      text: "Hi team 👋",
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      text: "Anyone up for lunch today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);

  const handleSendMessage = useCallback((text) => {
    const newUserMessage = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: "Let me know what you'd like to do!",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  }, []);

  return (
    <div className={styles.container}>
      {/* Left side illustration */}
      <div className={styles.illustrationContainer}>
        <div style={{ position: "absolute", top: 20, left: 20 }}>
          <ProfileMenu />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <img
            src="/calendar-illustration.svg"
            alt="Calendar Illustration"
            className={styles.illustration}
          />
        </div>
      </div>

      {/* Right side chat */}
      <div className={styles.chatContainer}>
        <div className={styles.messagesContainer}>
          <Stack gap="md">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
          </Stack>
        </div>

        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
}

export default Chat;
