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
  Title,
  LoadingOverlay,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useToggle } from "@mantine/hooks";
import { IconBrandMantine } from "@tabler/icons-react";
import classes from "../../styles/AuthenticationImage.module.css";
import React from "react";
import { GoogleButton } from "./GoogleButton";
import useStore from "../../store/useStore";
import { useAuthentication } from "../../hooks/useAuthentication";

export function AuthenticationImage() {
  const [type, toggle] = useToggle(["login", "register"]);
  const isLoading = useStore((state) => state.isLoading);
  const { handleLogin, handleRegister } = useAuthentication();

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
        type === "register"
          ? val !== values.password
            ? "Passwords do not match"
            : !val
            ? "Please confirm your password"
            : null
          : null,
      firstName: (val) =>
        type === "register" && !val ? "First Name is required" : null,
      lastName: (val) =>
        type === "register" && !val ? "Last Name is required" : null,
      address: (val) =>
        type === "register" && !val ? "Address is required" : null,
      phoneNumber: (val) =>
        type === "register" && !val ? "Phone Number is required" : null,
    },
  });

  const handleSubmit = async (values) => {
    try {
      if (type === "login") {
        const result = await handleLogin({
          email: values.email,
          password: values.password,
          rememberMe: false,
        });

        if (!result?.success) {
          throw new Error(result?.error || "Login failed");
        }
      } else {
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
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  const handleGoogleAuth = () => {
    console.log("Google authentication not implemented yet");
  };

  return (
    <div className={classes.wrapper}>
      <Paper className={classes.form} pos="relative">
        <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />
        <div className={classes.logo}>
          <IconBrandMantine
            size={42}
            stroke={1.5}
            color="var(--mantine-primary-color-filled)"
          />
          <Text
            c="var(--mantine-primary-color-filled)"
            className={classes.logoText}
          >
            Mantine
          </Text>
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
                <>
                  <Group grow>
                    <TextInput
                      required
                      label="First Name"
                      placeholder="Your First Name"
                      value={form.values.firstName}
                      onChange={(event) =>
                        form.setFieldValue(
                          "firstName",
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.firstName}
                      radius="md"
                      disabled={isLoading}
                    />
                    <TextInput
                      required
                      label="Last Name"
                      placeholder="Your Last Name"
                      value={form.values.lastName}
                      onChange={(event) =>
                        form.setFieldValue(
                          "lastName",
                          event.currentTarget.value
                        )
                      }
                      error={form.errors.lastName}
                      radius="md"
                      disabled={isLoading}
                    />
                  </Group>
                  <TextInput
                    required
                    label="Address"
                    placeholder="Enter your address"
                    value={form.values.address}
                    onChange={(event) =>
                      form.setFieldValue("address", event.currentTarget.value)
                    }
                    error={form.errors.address}
                    radius="md"
                    disabled={isLoading}
                  />
                  <TextInput
                    required
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    value={form.values.phoneNumber}
                    onChange={(event) =>
                      form.setFieldValue(
                        "phoneNumber",
                        event.currentTarget.value
                      )
                    }
                    error={form.errors.phoneNumber}
                    radius="md"
                    disabled={isLoading}
                  />
                </>
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
                <PasswordInput
                  required
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={form.values.confirmPassword}
                  onChange={(event) =>
                    form.setFieldValue(
                      "confirmPassword",
                      event.currentTarget.value
                    )
                  }
                  error={form.errors.confirmPassword}
                  radius="md"
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
                      Sign up
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
