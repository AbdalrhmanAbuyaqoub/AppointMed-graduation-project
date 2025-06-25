import { useMutation } from "@tanstack/react-query";
import { chatService } from "../services/chatService";
import NotificationService from "../services/NotificationService";
import { useState, useEffect, useRef } from "react";

export function useChatQueries() {
  const [messages, setMessages] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const timeoutRef = useRef(null);

  // Chat timeout duration in milliseconds (5 minutes)
  const CHAT_TIMEOUT = 5 * 60 * 1000;

  // Welcome message from chatbot
  const welcomeMessage = {
    id: "welcome-message",
    text: "مرحباً! 👋 أنا مساعدك الذكي. أنا هنا لمساعدتك في حجز موعدك. كيف يمكنني مساعدتك اليوم؟\n\nHello! 👋 I'm your AI assistant. I'm here to help you to Book Your appointment. How can I help you today?",
    isUser: false,
    timestamp: new Date(),
  };

  // Session timeout message
  const timeoutMessage = {
    id: `timeout-${Date.now()}`,
    text: "⏰ Your session has ended due to inactivity. Please send a new message to start again.",
    isUser: false,
    timestamp: new Date(),
  };

  // Function to start/restart the timeout
  const startTimeout = (forceStart = false) => {
    console.log(
      "[TIMEOUT] startTimeout called - hasUserInteracted:",
      hasUserInteracted,
      "forceStart:",
      forceStart
    );

    // Only start timeout if user has interacted (or forced)
    if (!hasUserInteracted && !forceStart) {
      console.log(
        "[TIMEOUT] Not starting timeout - user hasn't interacted yet and not forced"
      );
      return;
    }

    // Clear existing timeout
    if (timeoutRef.current) {
      console.log("[TIMEOUT] Clearing existing timeout");
      clearTimeout(timeoutRef.current);
    }

    // Start new timeout
    console.log(
      "[TIMEOUT] Starting new timeout - duration:",
      CHAT_TIMEOUT / 1000,
      "seconds"
    );
    timeoutRef.current = setTimeout(async () => {
      console.log("[TIMEOUT] ⏰ Chat session timeout triggered!");

      // Clear backend chat but keep local messages
      try {
        console.log("[TIMEOUT] Attempting to clear backend chat...");
        await chatService.clearChat();
        console.log(
          "[TIMEOUT] ✅ Backend chat cleared successfully on timeout"
        );
      } catch (error) {
        console.warn(
          "[TIMEOUT] ❌ Failed to clear backend chat on timeout:",
          error
        );
      }

      // Add timeout message to existing conversation (don't clear local messages)
      console.log("[TIMEOUT] Adding timeout message to conversation");
      setMessages((prev) => {
        const newMessages = [
          ...prev,
          { ...timeoutMessage, id: `timeout-${Date.now()}` },
        ];
        console.log(
          "[TIMEOUT] New message count after timeout:",
          newMessages.length
        );
        return newMessages;
      });

      // Reset interaction flag so timeout won't restart until user sends another message
      console.log("[TIMEOUT] Resetting hasUserInteracted flag to false");
      setHasUserInteracted(false);

      console.log("[TIMEOUT] Session timeout processing complete");
    }, CHAT_TIMEOUT);

    console.log("[TIMEOUT] Timeout set with ID:", timeoutRef.current);
  };

  // Function to clear timeout
  const clearChatTimeout = () => {
    if (timeoutRef.current) {
      console.log("[TIMEOUT] Clearing timeout with ID:", timeoutRef.current);
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
      console.log("[TIMEOUT] Timeout cleared and reset to null");
    } else {
      console.log("[TIMEOUT] No active timeout to clear");
    }
  };

  // Initialize with welcome message after component mounts
  useEffect(() => {
    if (!isInitialized) {
      console.log("[CHAT] Initializing chat with welcome message");
      setMessages([welcomeMessage]);
      setIsInitialized(true);
      console.log(
        "[CHAT] Chat initialized - NOT starting timeout (waiting for user interaction)"
      );
    }
  }, [isInitialized]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      console.log("[CHAT] Component unmounting - cleaning up timeout");
      clearChatTimeout();
    };
  }, []);

  // Debug log for hasUserInteracted changes
  useEffect(() => {
    console.log(
      "[USER_INTERACTION] hasUserInteracted changed to:",
      hasUserInteracted
    );
  }, [hasUserInteracted]);

  // Mutation for sending messages
  const sendMessage = useMutation({
    mutationFn: async (text) => {
      console.log("[MESSAGE] User sending message:", text);

      // Mark that user has interacted and start/restart timeout
      const isFirstInteraction = !hasUserInteracted;
      if (isFirstInteraction) {
        console.log("[USER_INTERACTION] 🎯 First user interaction detected!");
        setHasUserInteracted(true);
        console.log("[USER_INTERACTION] Setting hasUserInteracted to true");
        // Force start timeout for first interaction to avoid race condition
        startTimeout(true);
      } else {
        console.log(
          "[USER_INTERACTION] User interaction (timeout will restart)"
        );
        startTimeout();
      }

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

      console.log(
        "[MESSAGE] Adding user message and temp bot message to conversation"
      );
      setMessages((prev) => {
        const newMessages = [...prev, userMessage, tempBotMessage];
        console.log(
          "[MESSAGE] Message count after adding user message:",
          newMessages.length
        );
        return newMessages;
      });

      // Send to API
      console.log("[API] Sending message to chatbot API...");
      const response = await chatService.sendMessage(text);
      console.log("[API] Received response from chatbot API");

      // Replace the temp bot message with the real response
      console.log("[MESSAGE] Replacing temp message with bot response");
      setMessages((prev) =>
        prev.map((msg) =>
          msg.isTemp && msg.id === tempBotMessage.id
            ? { ...msg, text: response.reply, isTemp: false }
            : msg
        )
      );

      // Restart timeout after receiving response
      console.log("[TIMEOUT] Restarting timeout after receiving bot response");
      startTimeout();

      console.log("[MESSAGE] Message send process completed successfully");
      return { userMessage };
    },
    onError: (error) => {
      console.error("[MESSAGE] ❌ Error sending message:", error);
      NotificationService.error("Error", "Failed to send message");

      // Remove the temp bot message on error
      console.log("[MESSAGE] Removing temp bot message due to error");
      setMessages((prev) => prev.filter((msg) => !msg.isTemp));

      // Restart timeout even on error (if user has interacted)
      if (hasUserInteracted) {
        console.log(
          "[TIMEOUT] Restarting timeout after message error (user has interacted)"
        );
        startTimeout();
      } else {
        console.log(
          "[TIMEOUT] Not restarting timeout after error (user hasn't interacted)"
        );
      }
    },
  });

  // Mutation for clearing chat
  const clearChat = useMutation({
    mutationFn: async () => {
      console.log("[CLEAR] Manual chat clear initiated");

      // Clear timeout when clearing chat
      console.log("[CLEAR] Clearing timeout before chat clear");
      clearChatTimeout();

      // Reset interaction flag
      console.log("[CLEAR] Resetting hasUserInteracted to false");
      setHasUserInteracted(false);

      // Call the API to clear chat on the backend
      console.log("[CLEAR] Calling API to clear backend chat...");
      const response = await chatService.clearChat();
      console.log("[CLEAR] Backend chat cleared successfully");

      // Clear messages locally and reset with welcome message
      console.log(
        "[CLEAR] Clearing local messages and resetting with welcome message"
      );
      setMessages([welcomeMessage]);

      console.log(
        "[CLEAR] Manual chat clear completed - NOT starting timeout (waiting for user interaction)"
      );

      return response;
    },
    onSuccess: () => {
      console.log("[CLEAR] ✅ Chat cleared successfully");
    },
    onError: (error) => {
      console.error("[CLEAR] ❌ Error clearing chat:", error);
      NotificationService.error("Error", "Failed to clear chat");
      console.log("[CLEAR] Not restarting timeout due to clear error");
    },
  });

  // Debug log for messages changes
  useEffect(() => {
    console.log("[MESSAGES] Message count changed to:", messages.length);
    if (messages.length > 0) {
      console.log("[MESSAGES] Latest message:", messages[messages.length - 1]);
    }
  }, [messages]);

  return {
    messages,
    isLoading: sendMessage.isPending,
    error: sendMessage.error,
    sendMessage: (text) => sendMessage.mutate(text),
    clearChat: () => clearChat.mutate(),
    isClearingChat: clearChat.isPending,
    startTimeout, // Expose for manual timeout control if needed
    clearChatTimeout, // Expose for manual timeout clearing if needed
  };
}
