import { AppShell, Container, Group } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { NavbarMinimal } from "../components/NavbarMinimal";
import React, { useState } from "react";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { useAuthentication } from "../hooks/useAuthentication";
import { ProfileMenu } from "../components/ProfileMenu";

export function MainLayout() {
  const { handleLogout } = useAuthentication();
  const [expanded, setExpanded] = useState(false);

  const adminMenuItems = [
    {
      label: "Profile",
      icon: <IconUser size={18} />,
      onClick: () => {},
    },
    {
      label: "Log Out",
      icon: <IconLogout size={18} />,
      onClick: handleLogout,
      color: "red",
    },
  ];

  return (
    <AppShell
      layout="alt"
      padding="md"
      navbar={{
        width: expanded ? 240 : 80,
        breakpoint: "sm",
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header p="md" withBorder={false}>
        <Group justify="flex-end" h="100%" mr={120}>
          <ProfileMenu label="Admin Menu" menuItems={adminMenuItems} />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar bg={"red.1"}>
        <NavbarMinimal onExpandChange={setExpanded} />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container fluid>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
