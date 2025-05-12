import React from "react";
import { Menu, ActionIcon } from "@mantine/core";
import { IconUser } from "@tabler/icons-react";

export function ProfileMenu({ menuItems = [], label }) {
  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon variant="filled" size={40} radius="xl">
          <IconUser size={24} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{label}</Menu.Label>

        {menuItems.map((item, index) => (
          <Menu.Item
            key={index}
            leftSection={item.icon}
            onClick={item.onClick}
            color={item.color}
            // style={{ fontSize: "16px" }}
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
