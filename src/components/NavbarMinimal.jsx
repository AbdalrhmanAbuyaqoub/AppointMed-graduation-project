import { useState } from "react";
import {
  IconGauge,
  IconHome2,
  IconLogout,
  IconSettings,
  IconUser,
  IconMessage,
} from "@tabler/icons-react";
import { Center, Stack, Tooltip, UnstyledButton } from "@mantine/core";
import classes from "../styles/NavbarMinimal.module.css";
// import appLogo from "../assets/app-logo.svg";
import { useNavigate } from "react-router-dom";

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={classes.link}
        data-active={active || undefined}
      >
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: "Home", path: "/home" },
  { icon: IconGauge, label: "Dashboard", path: "/dashboard" },
  { icon: IconMessage, label: "Chat", path: "/chat" },
  { icon: IconSettings, label: "Settings", path: "/settings" },
];

export function NavbarMinimal() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();

  const handleNavigation = (path, index) => {
    setActive(index);
    navigate(path);
  };

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => handleNavigation(link.path, index)}
    />
  ));

  return (
    <nav className={classes.navbar}>
      {/* <Center>
        <img src={appLogo} alt="App Logo" width={30} height={30} />
      </Center> */}

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink
          icon={IconUser}
          label="Login"
          onClick={() => navigate("/login")}
        />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
