import React from "react";
import { Menu, ActionIcon } from "@mantine/core";
import { IconUser, IconLogout, IconSettings } from "@tabler/icons-react";

export function ProfileMenu() {
  return (
    <div style={{ position: "fixed", top: 20, left: 20, zIndex: 1000 }}>
      <Menu shadow="md" width={200} position="bottom-start">
        <Menu.Target>
          <ActionIcon
            variant="filled"
            size={40}
            radius="xl"
            style={{
              backgroundColor: "#00e5c9",
              color: "white",
              "&:hover": {
                backgroundColor: "#00d1b8",
              },
            }}
          >
            <IconUser size={24} />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Label>Application</Menu.Label>
          <Menu.Item leftSection={<IconUser size={14} />}>Profile</Menu.Item>
          <Menu.Item leftSection={<IconSettings size={14} />}>
            Settings
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item leftSection={<IconLogout size={14} />} color="red">
            Logout
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
