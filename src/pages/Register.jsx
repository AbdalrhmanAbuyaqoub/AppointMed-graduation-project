import {
  Anchor,
  Button,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Container,
  Space,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import BaseLogoSvg from "../assets/baseLogo.svg?react";
import LogoSvg from "../assets/logo.svg?react";
import { theme } from "../theme";
import { useForm } from "@mantine/form";
import { IconBrandMantine } from "@tabler/icons-react";
import classes from "../styles/AuthenticationImage.module.css";
import React from "react";
import { GoogleButton } from "../components/Login/GoogleButton";
import useStore from "../store/useStore";
import { useAuthentication } from "../hooks/useAuthentication";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const isLoading = useStore((state) => state.isLoading);
  const { handleRegister } = useAuthentication();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPassword: "",
      address: "",
      phoneNumber: "",
    },

    validate: {
      email: (val) => {
        if (!val) return "Email is required";
        if (!/^\S+@\S+$/.test(val)) return "Invalid email address";
        return null;
      },
      password: (val) => {
        if (!val) return "Password is required";
        if (val.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(val))
          return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(val))
          return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(val))
          return "Password must contain at least one number";
        return null;
      },
      confirmPassword: (val, values) =>
        val !== values.password
          ? "Passwords do not match"
          : !val
          ? "Please confirm your password"
          : null,
      firstName: (val) => (!val ? "First Name is required" : null),
      lastName: (val) => (!val ? "Last Name is required" : null),
      address: (val) => (!val ? "Address is required" : null),
      phoneNumber: (val) => (!val ? "Phone Number is required" : null),
    },
  });

  const handleSubmit = async (values) => {
    try {
      const result = await handleRegister({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        confirmPassword: values.confirmPassword,
        address: values.address,
        phoneNumber: values.phoneNumber,
      });

      if (!result?.success) {
        throw new Error(result?.error || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  const handleGoogleAuth = () => {
    console.log("Google authentication not implemented yet");
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

      <Paper withBorder shadow="md" radius="lg" p="xl" mx="auto" w="500">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

        <Group pb="md" justify="center">
          <BaseLogoSvg
            height={60}
            width={60}
            onClick={() => navigate("/")}
            cursor="pointer"
          />
        </Group>
        <Text size="30px" ta="center" mb="xl" fw={500}>
          Create an account
        </Text>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack>
            <Group grow>
              <TextInput
                size="md"
                required
                label="First Name"
                placeholder="e.g. John"
                value={form.values.firstName}
                onChange={(event) =>
                  form.setFieldValue("firstName", event.currentTarget.value)
                }
                error={form.errors.firstName}
                radius="md"
                disabled={isLoading}
              />
              <TextInput
                size="md"
                required
                label="Last Name"
                placeholder="e.g. Doe"
                value={form.values.lastName}
                onChange={(event) =>
                  form.setFieldValue("lastName", event.currentTarget.value)
                }
                error={form.errors.lastName}
                radius="md"
                disabled={isLoading}
              />
            </Group>
            <TextInput
              size="md"
              required
              label="Phone Number"
              placeholder="e.g. 09123456789"
              value={form.values.phoneNumber}
              onChange={(event) =>
                form.setFieldValue("phoneNumber", event.currentTarget.value)
              }
              error={form.errors.phoneNumber}
              radius="md"
              disabled={isLoading}
            />
            <TextInput
              size="md"
              required
              label="Address"
              placeholder="e.g. Main St, Nablus, Palestine"
              value={form.values.address}
              onChange={(event) =>
                form.setFieldValue("address", event.currentTarget.value)
              }
              error={form.errors.address}
              radius="md"
              disabled={isLoading}
            />

            <TextInput
              size="md"
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
            />

            <PasswordInput
              size="md"
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
            />

            <PasswordInput
              size="md"
              required
              label="Confirm Password"
              placeholder="Confirm your password"
              value={form.values.confirmPassword}
              onChange={(event) =>
                form.setFieldValue("confirmPassword", event.currentTarget.value)
              }
              error={form.errors.confirmPassword}
              radius="md"
              disabled={isLoading}
            />

            <Button
              mt="lg"
              type="submit"
              radius="xl"
              size="lg"
              fullWidth
              loading={isLoading}
            >
              Create account
            </Button>

            <Text ta="center" size="sm">
              Already have an account?{" "}
              <Anchor
                component="button"
                type="button"
                onClick={() => navigate("/login")}
                fw={500}
                disabled={isLoading}
              >
                Sign in
              </Anchor>
            </Text>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
