import { useState, useEffect } from "react";
import {
  IconBrandMantine,
  IconChevronsRight,
  IconCalendarWeek,
  IconLayoutGrid,
  IconBuildingHospital,
  IconStethoscope,
} from "@tabler/icons-react";
import {
  Center,
  Stack,
  Tooltip,
  AppShell,
  Group,
  Card,
  Drawer,
  Button,
  Space,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { theme } from "../theme";

function NavbarLink({ icon: Icon, label, active, onClick, expanded }) {
  const { hovered, ref } = useHover();

  return (
    <Tooltip
      label={label}
      radius="md"
      position="right"
      transitionProps={{ duration: 0 }}
      disabled={expanded}
    >
      <Card
        ref={ref}
        onClick={onClick}
        w={expanded ? "100%" : 50}
        h={50}
        px="xs"
        radius="md"
        bg={
          active
            ? "var(--mantine-primary-color-light)"
            : hovered
            ? "var(--mantine-color-gray-1)"
            : "transparent"
        }
        c={active ? theme.primaryColor : "gray.7"}
      >
        <Group>
          <Icon size={20} stroke={1.8} />
          {label}
        </Group>
      </Card>
    </Tooltip>
  );
}

const navLinks = [
  { icon: IconLayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: IconCalendarWeek, label: "Appointments", path: "/appointments" },
  { icon: IconBuildingHospital, label: "Clinics", path: "/clinics" },
  { icon: IconStethoscope, label: "Doctors", path: "/doctors" },
];

export function NavbarMinimal({
  expanded,
  onExpandChange,
  isMobile,
  mobileOpened,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { hovered: toggleHovered, ref: toggleRef } = useHover();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onExpandChange?.(false);
    }
  };

  const toggleExpand = () => {
    onExpandChange?.(!expanded);
  };

  const isExpanded = isMobile ? mobileOpened : expanded;

  const navigationContent = (
    <Stack gap={4}>
      {navLinks.map((link) => (
        <NavbarLink
          {...link}
          key={link.label}
          active={location.pathname === link.path}
          onClick={() => handleNavigation(link.path)}
          expanded={isExpanded}
        />
      ))}
    </Stack>
  );

  const navContent = (
    <Stack>
      <IconBrandMantine size={35} color={theme.primaryColor} />
      <Space h={30} />
      {navigationContent}
    </Stack>
  );

  if (isMobile) {
    return (
      <Drawer
        opened={mobileOpened}
        onClose={() => onExpandChange?.(false)}
        size={240}
        withCloseButton
        transitionProps={{ transition: "slide-right" }}
      >
        {navContent}
      </Drawer>
    );
  }

  return (
    <AppShell.Navbar w={expanded ? 240 : 80} p="md">
      {navContent}
      <Center>
        <Button
          ref={toggleRef}
          onClick={toggleExpand}
          pos="absolute"
          right={-12}
          p={0}
          m={0}
          top="2%"
          c="gray.7"
          radius="xl"
          bg={toggleHovered ? "gray.1" : "white"}
        >
          <IconChevronsRight size={20} />
        </Button>
      </Center>
    </AppShell.Navbar>
  );
}
