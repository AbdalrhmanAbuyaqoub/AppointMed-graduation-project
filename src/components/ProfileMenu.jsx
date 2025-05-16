import React from "react";
import { Group, Menu, ActionIcon } from "@mantine/core";
import { IconUser, IconCaretDownFilled } from "@tabler/icons-react";

export function ProfileMenu({ menuItems = [], label }) {
  return (
    <Menu radius={"md"} shadow="md" width={250} position="bottom-end">
      <Menu.Target>
        <Group gap={4}>
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

      <Menu.Dropdown>
        <Menu.Label fw={"600"} c={"black"} fz={"md"}>
          {label}
        </Menu.Label>

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
