import { AppShell, Container } from "@mantine/core";
import { Outlet } from "react-router-dom";
import { NavbarMinimal } from "../components/NavbarMinimal";
import React from "react";

export function MainLayout() {
  return (
    <AppShell
      padding="md"
      navbar={{
        width: 80,
        breakpoint: "sm",
      }}
    >
      <AppShell.Navbar>
        <NavbarMinimal />
      </AppShell.Navbar>

      <AppShell.Main>
        <Container>
          <Outlet />
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}
