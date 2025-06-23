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
  PinInput,
  Alert,
  Stepper,
} from "@mantine/core";
import BaseLogoSvg from "../assets/baseLogo.svg?react";
import LogoSvg from "../assets/logo.svg?react";
import { theme } from "../theme";
import { useForm } from "@mantine/form";
import {
  IconBrandMantine,
  IconMail,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import classes from "../styles/AuthenticationImage.module.css";
import React, { useState, useEffect } from "react";
import { GoogleButton } from "../components/Login/GoogleButton";
import useStore from "../store/useStore";
import { useAuthentication } from "../hooks/useAuthentication";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { authService } from "../services/authService";

const Register = () => {
  const navigate = useNavigate();
  const isLoading = useStore((state) => state.isLoading);
  const { handleRegister } = useAuthentication();
  const [currentStep, setCurrentStep] = useState(0);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [emailVerified, setEmailVerified] = useState(false);

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

  useEffect(() => {
    // Countdown timer for resend button
    if (resendCooldown > 0) {
      const timer = setTimeout(
        () => setResendCooldown(resendCooldown - 1),
        1000
      );
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleSendVerificationCode = async () => {
    const emailValidation = form.validateField("email");
    if (emailValidation.hasError) {
      return;
    }

    try {
      const result = await authService.sendVerificationCode(form.values.email);

      if (result.success) {
        setCurrentStep(1);
        setResendCooldown(60);
        notifications.show({
          title: "Code Sent",
          message: result.message,
          color: "green",
          icon: <IconMail size={16} />,
        });
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
        message: "Failed to send verification code. Please try again.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      notifications.show({
        title: "Invalid Code",
        message: "Please enter a 6-digit verification code",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setIsVerifying(true);

    try {
      const result = await authService.verifyCode(
        form.values.email,
        verificationCode
      );

      if (result.success) {
        setEmailVerified(true);
        setCurrentStep(2);
        notifications.show({
          title: "Email Verified",
          message: "Email verified successfully! Complete your registration.",
          color: "green",
          icon: <IconCheck size={16} />,
        });
      } else {
        notifications.show({
          title: "Verification Failed",
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

    setIsVerifying(false);
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;

    setIsResending(true);

    try {
      const result = await authService.sendVerificationCode(form.values.email);

      if (result.success) {
        notifications.show({
          title: "Code Sent",
          message: result.message,
          color: "green",
          icon: <IconMail size={16} />,
        });
        setResendCooldown(60);
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
        message: "Failed to resend verification code. Please try again.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
    }

    setIsResending(false);
  };

  const handleSubmit = async (values) => {
    if (!emailVerified) {
      notifications.show({
        title: "Email Not Verified",
        message: "Please verify your email before completing registration.",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

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
        <LoadingOverlay
          visible={isLoading || isVerifying}
          overlayProps={{ blur: 2 }}
        />

        <Group pb="md" justify="center">
          <BaseLogoSvg
            height={60}
            width={60}
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </Group>
        <Text size="30px" ta="center" mb="md" fw={500}>
          Create an account
        </Text>

        <Stepper active={currentStep} breakpoint="sm" mb="xl">
          <Stepper.Step label="Email" description="Enter your email">
            Step 1: Email verification
          </Stepper.Step>
          <Stepper.Step label="Verify" description="Verify code">
            Step 2: Email verification
          </Stepper.Step>
          <Stepper.Step label="Complete" description="Finish registration">
            Step 3: Complete registration
          </Stepper.Step>
        </Stepper>

        {currentStep === 0 && (
          <Stack gap="lg">
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

            <Button
              size="lg"
              radius="xl"
              fullWidth
              onClick={handleSendVerificationCode}
              loading={isLoading}
              disabled={!form.values.email}
            >
              Send Verification Code
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
        )}

        {currentStep === 1 && (
          <Stack gap="lg">
            <Alert icon={<IconMail size={16} />} variant="light">
              We've sent a 6-digit verification code to{" "}
              <Text component="span" fw={500}>
                {form.values.email}
              </Text>
              . Please check your inbox.
            </Alert>

            <Group justify="center">
              <PinInput
                length={6}
                value={verificationCode}
                onChange={setVerificationCode}
                size="lg"
                type="number"
                placeholder="○"
                disabled={isVerifying}
              />
            </Group>

            <Button
              size="lg"
              radius="xl"
              fullWidth
              onClick={handleVerifyCode}
              loading={isVerifying}
              disabled={verificationCode.length !== 6}
            >
              Verify Code
            </Button>

            <Group justify="center" gap="xs">
              <Text size="sm" c="dimmed">
                Didn't receive the code?
              </Text>
              <Button
                variant="subtle"
                size="sm"
                onClick={handleResendCode}
                loading={isResending}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0
                  ? `Resend in ${resendCooldown}s`
                  : "Resend Code"}
              </Button>
            </Group>

            <Button
              variant="subtle"
              onClick={() => setCurrentStep(0)}
              disabled={isVerifying}
            >
              ← Change Email
            </Button>
          </Stack>
        )}

        {currentStep === 2 && (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap="md">
              <Alert
                icon={<IconCheck size={16} />}
                color="green"
                variant="light"
                mb="md"
              >
                Email verified successfully! Complete your registration below.
              </Alert>

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
                value={form.values.email}
                radius="md"
                disabled
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
                  form.setFieldValue(
                    "confirmPassword",
                    event.currentTarget.value
                  )
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
                Complete Registration
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
        )}
      </Paper>
    </Container>
  );
};

export default Register;
