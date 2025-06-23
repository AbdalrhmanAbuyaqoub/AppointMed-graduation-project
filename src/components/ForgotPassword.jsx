import React, { useState } from "react";
import { Stack, Text, TextInput, Button, Anchor, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconMail,
  IconCheck,
  IconChevronLeft,
} from "@tabler/icons-react";
import { useAuthentication } from "../hooks/useAuthentication";

const ForgotPassword = ({ onBackToLogin }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { handleForgotPassword } = useAuthentication();

  const form = useForm({
    initialValues: {
      email: "",
    },
    validate: {
      email: (val) => {
        if (!val) return "Email is required";
        if (!/^\S+@\S+$/.test(val)) return "Invalid email address";
        return null;
      },
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);

    try {
      const result = await handleForgotPassword(values.email);

      if (result.success) {
        setIsSuccess(true);
        notifications.show({
          title: "Success",
          message: result.message,
          color: "green",
          icon: <IconCheck size={16} />,
        });
        form.reset();
      } else {
        notifications.show({
          title: "Error",
          message: result.error,
          color: "red",
          icon: <IconAlertCircle size={16} />,
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred. Please try again.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }

    setIsSubmitting(false);
  };

  const handleBackToLogin = () => {
    setIsSuccess(false);
    form.reset();
    onBackToLogin();
  };

  if (isSuccess) {
    return (
      <Stack>
        <Alert
          icon={<IconMail size={16} />}
          title="Email Sent"
          color="green"
          variant="light"
        >
          We've sent a new password to your email address. Please check your
          inbox and use the new password to log in.
        </Alert>
        <Text ta="center" size="sm" mt="md">
          <Anchor
            component="button"
            type="button"
            onClick={handleBackToLogin}
            fw={500}
            disabled={isSubmitting}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <IconChevronLeft size={16} />
            Back to Login
          </Anchor>
        </Text>
      </Stack>
    );
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          required
          radius="md"
          label="Email Address"
          placeholder="your@email.com"
          value={form.values.email}
          onChange={(event) =>
            form.setFieldValue("email", event.currentTarget.value)
          }
          error={form.errors.email}
          disabled={isSubmitting}
          size="md"
        />
        <Text size="sm" c="dimmed" ta="center">
          We'll send you a new password to your email address.
        </Text>

        <Button
          type="submit"
          radius="xl"
          fullWidth
          loading={isSubmitting}
          disabled={!form.values.email}
          size="lg"
          mt="md"
        >
          Send New Password
        </Button>

        <Text ta="center" size="sm" mt="md">
          <Anchor
            component="button"
            type="button"
            onClick={handleBackToLogin}
            fw={500}
            disabled={isSubmitting}
            style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}
          >
            <IconChevronLeft size={16} />
            Back to Login
          </Anchor>
        </Text>
      </Stack>
    </form>
  );
};

export default ForgotPassword;
