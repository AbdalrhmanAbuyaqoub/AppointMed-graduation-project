import React from "react";
import { Group, Menu, ActionIcon, Avatar, Text, Stack } from "@mantine/core";
import { IconCaretDownFilled } from "@tabler/icons-react";
import { getUserInitials, getFullName } from "../utils/userUtils";

export function ProfileMenu({ menuItems = [], user }) {
  return (
    <Menu radius={"md"} shadow="md" position="bottom-end">
      <Menu.Target>
        <Group gap={4} style={{ cursor: "pointer" }}>
          <Avatar
            c={"black"}
            color="gray.3"
            variant="filled"
            size={40}
            radius="xl"
          >
            <Text>
              {getUserInitials({
                firstName: user?.firstName,
                lastName: user?.lastName,
              })}
            </Text>
          </Avatar>
          <IconCaretDownFilled size={20} />
        </Group>
      </Menu.Target>

      <Menu.Dropdown miw={280}>
        {/* User Info Section */}
        <Group p="sm">
          <Avatar size="40px" radius="xl" variant="filled" color="gray.3">
            <Text>
              {getUserInitials({
                firstName: user?.firstName,
                lastName: user?.lastName,
              })}
            </Text>
          </Avatar>
          <Stack gap={0}>
            <Text fw={600} size="md">
              {getFullName({
                firstName: user?.firstName,
                lastName: user?.lastName,
              })}
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
