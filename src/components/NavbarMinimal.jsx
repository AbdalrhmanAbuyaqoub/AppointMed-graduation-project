import { useState, useEffect } from "react";
import {
  IconChevronsRight,
  IconCalendarEvent,
  IconLayoutGrid,
  IconBuildingHospital,
  IconStethoscope,
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

  const LogoComponent = () => (
    <svg
      width="40"
      height="40"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transition: "all 0.3s ease" }}
    >
      <defs>
        <linearGradient
          id="logo-gradient"
          x1="68"
          y1="0"
          x2="0"
          y2="68"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>
      <path
        d="M54 4H14C8.47715 4 4 8.47715 4 14V54C4 59.5228 8.47715 64 14 64H54C59.5228 64 64 59.5228 64 54V14C64 8.47715 59.5228 4 54 4Z"
        fill="url(#logo-gradient)"
      />
      <path
        d="M48 34H38V24"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 34H30V44"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 20V30H24"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 48V38H44"
        stroke="white"
        strokeOpacity="0.8"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const navContent = (
    <Stack>
      <Group ml={5} gap={4}>
        <LogoComponent />
        {isExpanded && (
          <Title order={1} fz="24" fw={700} ff="Plus Jakarta Sans">
            <span style={{ color: "#4C1D95" }}>Appoint</span>
            <span style={{ color: "#8B5CF6" }}>Med</span>
          </Title>
        )}
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
