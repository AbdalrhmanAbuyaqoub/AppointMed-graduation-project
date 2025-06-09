import { useMutation } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import NotificationService from "../services/NotificationService";
import { useState } from "react";

export function useChatQueries() {
  const [messages, setMessages] = useState([]);

  // Mutation for sending messages
  const sendMessage = useMutation({
    mutationFn: async (text) => {
      // Add user message immediately
      const userMessage = {
        id: Date.now().toString(),
        text,
        isUser: true,
        timestamp: new Date(),
      };

      // Add temporary bot message with '...'
      const tempBotMessage = {
        id: (Date.now() + 1).toString(),
        text: "...",
        isUser: false,
        timestamp: new Date(),
        isTemp: true,
      };

      setMessages((prev) => [...prev, userMessage, tempBotMessage]);

      // Send to API
      const response = await chatService.sendMessage(text);

      // Replace the temp bot message with the real response
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isTemp && msg.id === tempBotMessage.id
            ? { ...msg, text: response.reply, isTemp: false }
            : msg
        )
      );

      return { userMessage };
    },
    onError: (error) => {
      NotificationService.error("Error", "Failed to send message");
      // Remove the temp bot message on error
      setMessages((prev) => prev.filter((msg) => !msg.isTemp));
    },
  });

  return {
    messages,
    isLoading: sendMessage.isPending,
    error: sendMessage.error,
    sendMessage: (text) => sendMessage.mutate(text),
  };
}
