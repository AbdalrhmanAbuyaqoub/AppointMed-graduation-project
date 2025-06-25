import React, { useState, useEffect } from "react";
import {
  Container,
  Paper,
  Title,
  Stack,
  Group,
  Avatar,
  Text,
  Button,
  Divider,
  Modal,
  PasswordInput,
  TextInput,
  Alert,
  Badge,
  SimpleGrid,
} from "@mantine/core";
import {
  IconMail,
  IconPhone,
  IconMapPin,
  IconTrash,
  IconLock,
  IconAlertTriangle,
  IconUser,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useAuthentication } from "../hooks/useAuthentication";
import { useUserQueries } from "../hooks/useUserQueries";
import { notifications } from "@mantine/notifications";
import { getToken } from "../services/tokenService";
import { getUserInitials, getFullName } from "../utils/userUtils";

// Function to decode JWT token and extract user ID
const decodeToken = (token) => {
  try {
    if (!token) return null;

    // JWT tokens have 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    console.log("Decoded token payload:", payload);

    return payload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

function Profile({ isModal = false, onClose }) {
  const { user, handleLogout } = useAuthentication();
  const {
    resetPasswordWithToken,
    deleteAccount,
    isResettingPassword,
    isDeletingAccount,
  } = useUserQueries();

  // Debug log when component mounts or user changes
  useEffect(() => {
    // Component initialization if needed
  }, [user]);

  // State for modals
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // State for password form
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // State for delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState("");

  // Function to get user ID from token or user object
  const getUserId = () => {
    // First try to get from user object - check multiple possible property names
    if (user?.id) {
      return user.id;
    }
    if (user?.userId) {
      return user.userId;
    }
    if (user?.user_id) {
      return user.user_id;
    }

    // If not in user object, try to extract from token using proper token service
    const token = getToken();
    const decodedToken = decodeToken(token);

    // Use the same logic as useAuthStore decodeToken function
    const userId =
      decodedToken?.nameid ||
      decodedToken?.userId ||
      decodedToken?.sub ||
      decodedToken?.id;

    return userId;
  };

  // Function to get user email from user object or token
  const getUserEmail = () => {
    // First try to get from user object
    if (user?.email) {
      return user.email;
    }

    // If not in user object, try to extract from token using proper token service
    const token = getToken();
    const decodedToken = decodeToken(token);

    const email = decodedToken?.email || decodedToken?.unique_name;
    return email;
  };

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      notifications.show({
        title: "Error",
        message: "New passwords do not match",
        color: "red",
      });
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      notifications.show({
        title: "Error",
        message: "Password must be at least 6 characters long",
        color: "red",
      });
      return;
    }

    // Get user email
    const userEmail = getUserEmail();

    // Validate user data
    if (!userEmail) {
      notifications.show({
        title: "Error",
        message:
          "User email is missing. Please try logging out and logging back in.",
        color: "red",
      });
      return;
    }

    try {
      const passwordData = {
        email: userEmail,
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
        confirmNewPassword: passwordForm.confirmNewPassword,
      };

      console.log("Password reset data being sent:", passwordData);
      await resetPasswordWithToken(passwordData);
      setIsPasswordModalOpen(false);
      setPasswordForm({
        oldPassword: "",
        newPassword: "",
        confirmNewPassword: "",
      });
    } catch (error) {
      // Error notification is already handled in resetPasswordWithToken
      console.error("Password reset failed:", error);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== "DELETE") {
      notifications.show({
        title: "Error",
        message: 'Please type "DELETE" to confirm account deletion',
        color: "red",
      });
      return;
    }

    const userEmail = getUserEmail();
    const userId = getUserId();

    if (!userEmail) {
      notifications.show({
        title: "Error",
        message:
          "User email is missing. Please try logging out and logging back in.",
        color: "red",
      });
      return;
    }

    try {
      // If we have both email and ID, use both. Otherwise, try with just email
      if (userId) {
        await deleteAccount({ email: userEmail, id: userId });
      } else {
        // Try calling with empty string for ID or modify the service call
        await deleteAccount({ email: userEmail, id: "" }); // Empty string as fallback
      }

      notifications.show({
        title: "Success",
        message: "Account deleted successfully. You will be logged out.",
        color: "green",
      });

      setIsDeleteModalOpen(false);

      // Close modal if it's open
      if (isModal && onClose) {
        onClose();
      }

      // Logout the user after successful deletion
      setTimeout(async () => {
        try {
          await handleLogout();
        } catch (logoutError) {
          // Force navigation to login even if logout fails
          window.location.href = "/login";
        }
      }, 1500); // Small delay to show the success message
    } catch (error) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to delete account",
        color: "red",
      });
    }
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Profile Information Card */}
        <Paper p="xl" radius="md" withBorder>
          <Stack gap="xl">
            {/* Header with Avatar and Name */}
            <Group gap="xl" align="flex-start">
              <Avatar size="xl" radius="xl" variant="filled">
                {getUserInitials({
                  firstName: user?.firstName,
                  lastName: user?.lastName,
                })}
              </Avatar>

              <Stack gap="xs" style={{ flex: 1 }}>
                <Title order={2} fz={28}>
                  {getFullName({
                    firstName:
                      user?.firstName?.charAt(0).toUpperCase() +
                      user?.firstName?.slice(1),
                    lastName:
                      user?.lastName?.charAt(0).toUpperCase() +
                      user?.lastName?.slice(1),
                  })}
                </Title>
                <Group gap="md">
                  <Badge size="lg" variant="filled" color="blue">
                    {user?.role?.toUpperCase() || "USER"}
                  </Badge>
                  <Badge size="lg" variant="light" color="green">
                    <Group gap="xs">
                      <IconCircleCheck size={16} />
                      <Text>Active Account</Text>
                    </Group>
                  </Badge>
                </Group>
              </Stack>
            </Group>

            <Divider />

            {/* User Details Grid */}
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
              {/* Basic Information */}
              <Stack gap="md">
                <Title order={3} size="h4">
                  Basic Information
                </Title>
                <Group gap="md">
                  <IconUser size={20} color="var(--mantine-color-gray-6)" />
                  <Text size="sm" fw={500}>
                    Full Name:
                  </Text>
                  <Text size="sm">
                    {getFullName({
                      firstName:
                        user?.firstName?.charAt(0).toUpperCase() +
                        user?.firstName?.slice(1),
                      lastName:
                        user?.lastName?.charAt(0).toUpperCase() +
                        user?.lastName?.slice(1),
                    })}
                  </Text>
                </Group>
                <Group gap="md">
                  <IconMail size={20} color="var(--mantine-color-gray-6)" />
                  <Text size="sm" fw={500}>
                    Email:
                  </Text>
                  <Text size="sm">{user?.email || "No email provided"}</Text>
                </Group>
              </Stack>

              {/* Contact Information */}
              <Stack gap="md">
                <Title order={3} size="h4">
                  Contact Information
                </Title>
                <Group gap="md">
                  <IconPhone size={20} color="var(--mantine-color-gray-6)" />
                  <Text size="sm" fw={500}>
                    Phone:
                  </Text>
                  <Text size="sm">{user?.phoneNumber || "Not provided"}</Text>
                </Group>
                <Group gap="md">
                  <IconMapPin size={20} color="var(--mantine-color-gray-6)" />
                  <Text size="sm" fw={500}>
                    Address:
                  </Text>
                  <Text size="sm">{user?.address || "Not provided"}</Text>
                </Group>
              </Stack>
            </SimpleGrid>

            <Divider />

            {/* Action Buttons */}
            <Group gap="md">
              <Button
                leftSection={<IconLock size={16} />}
                onClick={() => setIsPasswordModalOpen(true)}
                variant="outline"
                radius="md"
                color="blue"
              >
                Reset Password
              </Button>

              <Button
                leftSection={<IconTrash size={16} />}
                onClick={() => setIsDeleteModalOpen(true)}
                variant="outline"
                color="red"
                radius="md"
              >
                Delete Account
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Reset Password Modal */}
        <Modal
          opened={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          title={<Text fw={600}>Reset Password</Text>}
          size="md"
        >
          <form onSubmit={handlePasswordReset}>
            <Stack gap="md">
              <PasswordInput
                radius="md"
                label="Current Password"
                placeholder="Enter current password"
                value={passwordForm.oldPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    oldPassword: e.target.value,
                  })
                }
                required
              />

              <PasswordInput
                radius="md"
                label="New Password"
                placeholder="Enter new password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
              />

              <PasswordInput
                radius="md"
                label="Confirm New Password"
                placeholder="Confirm new password"
                value={passwordForm.confirmNewPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    confirmNewPassword: e.target.value,
                  })
                }
                required
              />

              <Group justify="flex-end" gap="md">
                <Button
                  variant="outline"
                  onClick={() => setIsPasswordModalOpen(false)}
                  radius="md"
                >
                  Cancel
                </Button>
                <Button type="submit" loading={isResettingPassword} radius="md">
                  Reset Password
                </Button>
              </Group>
            </Stack>
          </form>
        </Modal>

        {/* Delete Account Modal */}
        <Modal
          opened={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          title="Delete Account"
          size="md"
          radius="md"
        >
          <Stack gap="md">
            <Alert
              p="xs"
              icon={<IconAlertTriangle size={16} />}
              title="Warning"
              color="red"
              variant="light"
            >
              This action cannot be undone. All your data will be permanently
              deleted.
            </Alert>

            <Text size="sm" c="dimmed">
              To confirm deletion, please type <strong>DELETE</strong> in the
              field below:
            </Text>

            <TextInput
              placeholder="Type DELETE to confirm"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
            />

            <Group justify="flex-end" gap="md">
              <Button
                variant="filled"
                radius="md"
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                color="red"
                radius="md"
                variant="outline"
                loading={isDeletingAccount}
                onClick={handleDeleteAccount}
              >
                Delete Account
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Stack>
    </Container>
  );
}

export default Profile;
