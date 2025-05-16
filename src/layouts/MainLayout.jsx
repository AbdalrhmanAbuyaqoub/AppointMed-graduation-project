import { AppShell, Container, Group, Burger } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { NavbarMinimal } from "../components/NavbarMinimal";
import React, { useState } from "react";
import { IconLogout, IconUser } from "@tabler/icons-react";
import { useAuthentication } from "../hooks/useAuthentication";
import { ProfileMenu } from "../components/ProfileMenu";
import { theme } from "../theme";
import { useViewportSize } from "@mantine/hooks";

export function MainLayout() {
  const { handleLogout } = useAuthentication();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpened, setMobileOpened] = useState(false);
  const { width } = useViewportSize();
  const isMobile = width < 768;

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

  const handleNavbarToggle = () => {
    if (isMobile) {
      setMobileOpened((o) => !o);
    } else {
      setExpanded((e) => !e);
    }
  };

  const handleNavbarStateChange = (newState) => {
    if (isMobile) {
      setMobileOpened(newState);
    } else {
      setExpanded(newState);
    }
  };

  return (
    <AppShell
      layout="alt"
      padding="md"
      navbar={{
        width: expanded ? 240 : 80,
        breakpoint: "sm",
        collapsed: { mobile: true, desktop: false },
      }}
      header={{ height: 60 }}
      withBorder
      transitionDuration={300}
      transitionTimingFunction="ease"
    >
      <AppShell.Header withBorder={false} bg={theme.backgroundColor} p="md">
        <Container maw={1232} fluid px="md">
          <Group justify="space-between" align="center" h="100%">
            <Group>
              <Burger
                opened={isMobile ? mobileOpened : expanded}
                onClick={handleNavbarToggle}
                hiddenFrom="sm"
                size="sm"
              />
            </Group>
            <ProfileMenu label="Admin Menu" menuItems={adminMenuItems} />
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Navbar>
        <NavbarMinimal
          expanded={expanded}
          onExpandChange={handleNavbarStateChange}
          isMobile={isMobile}
          mobileOpened={mobileOpened}
        ></NavbarMinimal>
      </AppShell.Navbar>

      <AppShell.Main bg={theme.backgroundColor}>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
