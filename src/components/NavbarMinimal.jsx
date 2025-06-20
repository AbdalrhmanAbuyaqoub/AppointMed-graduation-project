import { useState, useEffect } from "react";
import {
  IconChevronsRight,
  IconCalendarEvent,
  IconLayoutGrid,
  IconBuildingHospital,
  IconStethoscope,
  IconUsers,
} from "@tabler/icons-react";
import {
  Title,
  Center,
  Stack,
  Tooltip,
  AppShell,
  Group,
  Container,
  Card,
  Drawer,
  Button,
  Space,
  Paper,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useNavigate, useLocation } from "react-router-dom";
import { theme } from "../theme";
import LogoSvg from "../assets/logo.svg?react";
import BaseLogoSvg from "../assets/baseLogo.svg?react";

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
        p="0"
        radius="md"
        bg={
          active
            ? "var(--mantine-primary-color-light)"
            : hovered
            ? "var(--mantine-color-gray-1)"
            : "transparent"
        }
        c={active ? theme.primaryColor : "black"}
      >
        <Group
          h={"100%"}
          justify={expanded ? "flex-start" : "center"}
          pl={expanded ? 13 : 0}
        >
          <Icon size={24} stroke={1.9} />
          {expanded && label}
        </Group>
      </Card>
    </Tooltip>
  );
}

const navLinks = [
  { icon: IconLayoutGrid, label: "Dashboard", path: "/dashboard" },
  { icon: IconCalendarEvent, label: "Appointments", path: "/appointments" },
  { icon: IconUsers, label: "Patients", path: "/patients" },
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
      <Group ml={5} gap={4}>
        {isExpanded ? <LogoSvg /> : <BaseLogoSvg />}
      </Group>
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
