import React from "react";
import { Stack, Paper, ScrollArea, Box, LoadingOverlay } from "@mantine/core";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";

export function ChatContainer({
  messages,
  isClearingChat,
  viewport,
  handleScroll,
  handleSendMessage,
  isMobile,
}) {
  console.log("ChatContainer - isMobile:", isMobile);

  return (
    <Paper
      h="100%"
      radius={isMobile ? 0 : "lg"}
      shadow={isMobile ? "none" : "sm"}
      //   bg={isMobile ? "green" : "red"}
      pos="relative"
    >
      <LoadingOverlay visible={isClearingChat} />
      <ScrollArea
        viewportRef={viewport}
        offsetScrollbars
        onScrollPositionChange={handleScroll}
        scrollbarSize={6}
        type="hover"
        scrollbars="y"
        style={{
          height: isMobile ? `calc(100dvh - 110px)` : `calc(100vh - 100px)`,
          position: isMobile ? "fixed" : "relative",
          top: isMobile ? "60px" : "auto",
          left: isMobile ? 0 : "auto",
          right: isMobile ? 0 : "auto",
          bottom: isMobile ? "60px" : "auto",
          //   backgroundColor: isMobile ? "green" : "red",
        }}
      >
        <Stack
          gap="md"
          p="md"
          justify="flex-end"
          style={{
            minHeight: "100%",
          }}
        >
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </Stack>
      </ScrollArea>
      <Box
        style={{
          position: isMobile ? "fixed" : "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: "60px",
          //   backgroundColor: isMobile ? "green" : "red",
        }}
      >
        <ChatInput onSendMessage={handleSendMessage} />
      </Box>
    </Paper>
  );
}
