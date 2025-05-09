import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { upperFirst, useToggle } from "@mantine/hooks";
import { IconBrandMantine } from "@tabler/icons-react";
import classes from "../../styles/AuthenticationImage.module.css";
import React, { useState } from "react";
import { GoogleButton } from "./GoogleButton";
import { useAuth } from "../../context/AuthContext";
import { notifications } from "@mantine/notifications";

export function AuthenticationImage() {
  const [type, toggle] = useToggle(["login", "register"]);
  const { login, register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      terms: true,
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
      name: (val) => (type === "register" && !val ? "Name is required" : null),
      terms: (val) =>
        type === "register" && !val
          ? "You must accept terms and conditions"
          : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      setIsLoading(true);
      if (type === "login") {
        await login(values.email, values.password);
        notifications.show({
          title: "Welcome back!",
          message: "You have successfully logged in",
          color: "green",
        });
      } else {
        await register({
          email: values.email,
          password: values.password,
          name: values.name,
        });
        notifications.show({
          title: "Registration Successful",
          message: "Please log in with your new account",
          color: "green",
        });
        toggle();
        form.reset();
      }
    } catch (error) {
      notifications.show({
        title: type === "login" ? "Login Failed" : "Registration Failed",
        message: error.message || "An unexpected error occurred",
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    notifications.show({
      title: "Not Implemented",
      message: "Google authentication is not implemented yet",
      color: "yellow",
    });
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <div className={classes.logo}>
          <IconBrandMantine
            size={42}
            stroke={1.5}
            color="var(--mantine-color-blue-filled)"
          />
          <Text className={classes.logoText}>Mantine</Text>
        </div>
        <div className={classes.formContainer}>
          <Title order={2} className={classes.title}>
            {type === "login" ? "Welcome back!" : "Create an account"}
          </Title>

          <Group grow mb="md" mt="md">
            <GoogleButton radius="md" onClick={handleGoogleAuth}>
              Continue with Google
            </GoogleButton>
          </Group>

          <Divider
            label="Or continue with email"
            labelPosition="center"
            my="lg"
          />

          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
              {type === "register" && (
                <TextInput
                  required
                  label="Name"
                  placeholder="Your name"
                  value={form.values.name}
                  onChange={(event) =>
                    form.setFieldValue("name", event.currentTarget.value)
                  }
                  error={form.errors.name}
                  radius="md"
                  disabled={isLoading}
                />
              )}

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
              />

              {type === "register" && (
                <Checkbox
                  label="I accept terms and conditions"
                  checked={form.values.terms}
                  onChange={(event) =>
                    form.setFieldValue("terms", event.currentTarget.checked)
                  }
                  error={form.errors.terms}
                  disabled={isLoading}
                />
              )}

              <Button type="submit" radius="md" fullWidth loading={isLoading}>
                {type === "login" ? "Sign in" : "Create account"}
              </Button>

              <Text ta="center" size="sm">
                {type === "register" ? (
                  <>
                    Already have an account?{" "}
                    <Anchor
                      component="button"
                      type="button"
                      onClick={() => {
                        toggle();
                        form.reset();
                      }}
                      fw={500}
                      disabled={isLoading}
                    >
                      Sign in
                    </Anchor>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <Anchor
                      component="button"
                      type="button"
                      onClick={() => {
                        toggle();
                        form.reset();
                      }}
                      fw={500}
                      disabled={isLoading}
                    >
                      Create one
                    </Anchor>
                  </>
                )}
              </Text>
            </Stack>
          </form>
        </div>
      </Paper>
      <div className={classes.imageWrapper} />
    </div>
  );
}
