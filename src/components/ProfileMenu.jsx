import React from "react";
import { Group, Menu, ActionIcon, Avatar, Text, Stack } from "@mantine/core";
import { IconUser, IconCaretDownFilled } from "@tabler/icons-react";

export function ProfileMenu({ menuItems = [], user }) {
  const getInitials = (firstName, lastName) => {
    if (!firstName && !lastName) return "U";
    const first = firstName ? firstName.charAt(0).toUpperCase() : "";
    const last = lastName ? lastName.charAt(0).toUpperCase() : "";
    return first + last;
  };

  const getFullName = (firstName, lastName) => {
    if (!firstName && !lastName) return "User";
    const fullName = `${firstName || ""} ${lastName || ""}`.trim();
    return fullName;
  };

  return (
    <Menu radius={"md"} shadow="md" position="bottom-end">
      <Menu.Target>
        <Group gap={4} style={{ cursor: "pointer" }}>
          <ActionIcon
            c={"black"}
            color="gray.3"
            variant="filled"
            size={40}
            radius="xl"
          >
            <IconUser size={24} />
          </ActionIcon>
          <IconCaretDownFilled size={20} />
        </Group>
      </Menu.Target>

      <Menu.Dropdown miw={280}>
        {/* User Info Section */}
        <Group p="sm">
          <Avatar size="40px" radius="xl" variant="filled">
            {user ? getInitials(user.firstName, user.lastName) : "U"}
          </Avatar>
          <Stack gap={0}>
            <Text fw={600} size="md">
              {user ? getFullName(user.firstName, user.lastName) : "User"}
            </Text>
            <Text size="sm" c="dimmed">
              {user?.email || "No email"}
            </Text>
          </Stack>
        </Group>

        <Menu.Divider />

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <Menu.Item
            key={index}
            leftSection={item.icon}
            onClick={item.onClick}
            color={item.color}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
