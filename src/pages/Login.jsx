import React from "react";
import { Container, Center } from "@mantine/core";
import { AuthenticationForm } from "../components/Login/AuthenticationForm";

function Login() {
  return (
    <Container size="sm">
      <Center style={{ minHeight: "100vh" }}>
        <AuthenticationForm />
      </Center>
    </Container>
  );
}

export default Login;
