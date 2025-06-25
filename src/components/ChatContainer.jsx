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
      bg="var(--mantine-color-gray-0)"
      pos="relative"
      style={{
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
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
          flex: 1,
          height: isMobile ? `calc(100dvh - 120px)` : `calc(100vh - 100px)`,
          position: "relative",
          backgroundColor: "var(--mantine-color-gray-0)",
        }}
      >
        <Stack
          gap="md"
          p="md"
          pb="80px"
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
          position: "relative",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60px",
          backgroundColor: "var(--mantine-color-gray-0)",
          borderTop: "1px solid var(--mantine-color-gray-2)",
        }}
      >
        <ChatInput onSendMessage={handleSendMessage} />
      </Box>
    </Paper>
  );
}
