import { AppShell, Container, Group, Burger, TextInput } from "@mantine/core";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { NavbarMinimal } from "../components/NavbarMinimal";
import React, { useState, useEffect } from "react";
import {
  IconLogout,
  IconUser,
  IconSettings,
  IconSearch,
} from "@tabler/icons-react";
import { useAuthentication } from "../hooks/useAuthentication";
import { ProfileMenu } from "../components/ProfileMenu";
import { theme } from "../theme";
import { useViewportSize } from "@mantine/hooks";
import useSearchStore from "../store/useSearchStore";
import { ROUTES } from "../routes/index";

export function MainLayout() {
  const { handleLogout, user } = useAuthentication();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [mobileOpened, setMobileOpened] = useState(false);
  const { width } = useViewportSize();
  const isMobile = width < 768;
  const location = useLocation();
  const { searchQuery, setSearchQuery, setCurrentPage, getPlaceholder } =
    useSearchStore();

  // Determine which page we're on and if it should show search
  const searchablePages = [
    "/appointments",
    "/patients",
    "/doctors",
    "/clinics",
  ];
  const currentPagePath = location.pathname;
  const isSearchablePage = searchablePages.includes(currentPagePath);
  const currentPageName = currentPagePath.replace("/", "");

  // Update current page in store when location changes
  useEffect(() => {
    if (isSearchablePage) {
      setCurrentPage(currentPageName);
    }
  }, [currentPagePath, isSearchablePage, currentPageName, setCurrentPage]);

  const adminMenuItems = [
    {
      label: "Profile",
      icon: <IconUser size={20} />,
      onClick: () => navigate(ROUTES.PROFILE),
    },
    {
      label: "Settings",
      icon: <IconSettings size={20} />,
      onClick: () => {},
    },
    {
      label: "Log Out",
      icon: <IconLogout size={20} />,
      onClick: handleLogout,
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

            {/* Search box - only shown on searchable pages */}
            {isSearchablePage && (
              <TextInput
                size="md"
                placeholder={getPlaceholder(currentPageName)}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftSection={<IconSearch size={16} />}
                style={{ flex: 1, maxWidth: 400 }}
                radius="xl"
              />
            )}

            <ProfileMenu menuItems={adminMenuItems} user={user} />
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
