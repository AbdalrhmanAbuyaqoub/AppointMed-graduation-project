import { useState } from "react";
import {
  IconGauge,
  IconHome2,
  IconSettings,
  IconBrandMantine,
  IconChevronsRight,
} from "@tabler/icons-react";
import {
  Center,
  Stack,
  Tooltip,
  UnstyledButton,
  Paper,
  Space,
  Group,
} from "@mantine/core";
import classes from "../styles/NavbarMinimal.module.css";
import { useNavigate } from "react-router-dom";

function NavbarLink({ icon: Icon, label, active, onClick, expanded }) {
  return (
    <Tooltip
      label={label}
      radius={"md"}
      position="right"
      transitionProps={{ duration: 0 }}
      disabled={expanded}
    >
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
        data-expanded={expanded || undefined}
      >
        <Icon className={classes.linkIcon} size={20} stroke={1.8} />
        <div className={classes.linkText} data-expanded={expanded || undefined}>
          {label}
        </div>
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", path: "/home" },
  { icon: IconGauge, label: "Dashboard", path: "/dashboard" },
  { icon: IconSettings, label: "Settings", path: "/settings" },
];

export function NavbarMinimal({ onExpandChange }) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path, index) => {
    setActive(index);
    navigate(path);
  };

  const toggleExpand = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandChange?.(newExpanded);
  };

  return (
    <Paper
      className={classes.navbar}
      // data-expanded={expanded || undefined}
      h={"100%"}
    >
      <Group justify="start" ml={10}>
        <IconBrandMantine
          className={classes.header}
          size={35}
          stroke={1.5}
          color="var(--mantine-primary-color-filled)"
        />
      </Group>

      <UnstyledButton className={classes.toggleButton} onClick={toggleExpand}>
        <Center>
          <IconChevronsRight
            size={20}
            style={{
              transform: expanded ? "rotate(180deg)" : "none",
              transition: "transform 200ms ease",
            }}
          />
        </Center>
      </UnstyledButton>

      <Space h={30} />

      <Stack gap={0} className={classes.navbarMain}>
        {mockdata.map((link, index) => (
          <NavbarLink
            {...link}
            key={link.label}
            active={index === active}
            onClick={() => handleNavigation(link.path, index)}
            expanded={expanded}
          />
        ))}
      </Stack>
    </Paper>
  );
}
