import {
  Anchor,
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  LoadingOverlay,
  Space,
  Checkbox,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useState, useEffect } from "react";
import { IconCheck } from "@tabler/icons-react";
import LogoSvg from "../assets/logo.svg?react";
import useStore from "../store/useStore";
import { useAuthentication } from "../hooks/useAuthentication";
import { useNavigate, useLocation } from "react-router-dom";
import { theme } from "../theme";
import BaseLogoSvg from "../assets/baseLogo.svg?react";
import ForgotPassword from "../components/ForgotPassword";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoading = useStore((state) => state.isLoading);
  const { handleLogin } = useAuthentication();
  const [mode, setMode] = useState("login"); // "login" or "forgot-password"
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },

    validate: {
      email: (val) => {
        if (!val) return "Email is required";
        if (!/^\S+@\S+$/.test(val)) return "Invalid email address";
        return null;
      },
      password: (val) => {
        if (!val) return "Password is required";
        return null;
      },
    },
  });

  useEffect(() => {
    // Handle success messages from verification or other flows
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Pre-fill email if provided
      if (location.state.email) {
        form.setFieldValue("email", location.state.email);
      }
      // Clear the state to prevent showing message on page refresh
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, navigate, form]);

  const handleSubmit = async (values) => {
    try {
      const result = await handleLogin({
        email: values.email,
        password: values.password,
        rememberMe: values.rememberMe,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const switchToForgotPassword = () => {
    setMode("forgot-password");
  };

  const switchToLogin = () => {
    setMode("login");
  };

  return (
    <Container w="100vw" h="100vh" fluid bg={theme.backgroundColor}>
      <Space h="50" />
      {/* <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.backgroundColor,
          marginBottom: "1rem",
        }}
      ></header> */}

      {/* Login form centered */}
      {/* <Container
        size="xs"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      > */}
      <Paper
        withBorder
        shadow="md"
        radius="lg"
        p="xl"
        w="100%"
        maw={400}
        mx="auto"
        pos="relative"
      >
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <Group pb="md" justify="center">
          <BaseLogoSvg
            height={60}
            width={60}
            onClick={() => navigate("/")}
            cursor="pointer"
          />
        </Group>
        <Text size="xl" ta="center" mb="xl" fw={500}>
          {mode === "login" ? "Login to your account" : "Reset Your Password"}
        </Text>

        {successMessage && (
          <Alert
            icon={<IconCheck size={16} />}
            title="Success"
            color="green"
            variant="light"
            mb="md"
            withCloseButton
            onClose={() => setSuccessMessage("")}
          >
            {successMessage}
          </Alert>
        )}

        {mode === "login" ? (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email}
                radius="md"
                disabled={isLoading}
                size="md"
              />

              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={form.values.password}
                onChange={(event) =>
                  form.setFieldValue("password", event.currentTarget.value)
                }
                error={form.errors.password}
                radius="md"
                disabled={isLoading}
                size="md"
              />

              <Checkbox
                label="Remember me"
                checked={form.values.rememberMe}
                onChange={(event) =>
                  form.setFieldValue("rememberMe", event.currentTarget.checked)
                }
                disabled={isLoading}
                size="sm"
              />

              <Group justify="flex-end">
                <Anchor
                  component="button"
                  type="button"
                  onClick={switchToForgotPassword}
                  size="sm"
                  disabled={isLoading}
                >
                  Forgot Password?
                </Anchor>
              </Group>

              <Button
                type="submit"
                radius="xl"
                fullWidth
                loading={isLoading}
                size="lg"
                mt="md"
              >
                Sign in
              </Button>

              <Text ta="center" size="sm" mt="md">
                Don't have an account?{" "}
                <Anchor
                  component="button"
                  type="button"
                  onClick={() => navigate("/register")}
                  fw={500}
                  disabled={isLoading}
                >
                  Sign up
                </Anchor>
              </Text>
            </Stack>
          </form>
        ) : (
          <ForgotPassword onBackToLogin={switchToLogin} />
        )}
      </Paper>

      {/* <ForgotPasswordModal
        opened={forgotPasswordOpened}
        onClose={() => setForgotPasswordOpened(false)}
      /> */}
    </Container>
    // </Container>
  );
};

export default Login;
