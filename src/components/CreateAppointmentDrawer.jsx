import {
  Drawer,
  Stack,
  Text,
  Group,
  Code,
  CopyButton,
  ActionIcon,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useAppointmentQueries } from "../hooks/useAppointmentQueries";
import AppointmentForm from "./AppointmentForm";

function CreateAppointmentDrawer({ opened, onClose }) {
  const { createAppointmentWithPatient } = useAppointmentQueries();

  const handleCreateAppointment = async (values) => {
    try {
      const response = await createAppointmentWithPatient.mutateAsync(values);

      // Handle success with different messages based on whether a new user was created
      if (response.userCreated && response.temporaryPassword) {
        // Create a custom notification with copy functionality
        const notificationContent = (
          <Stack gap="xs">
            <Text size="sm">
              Appointment created successfully! A new patient account has been
              created.
            </Text>
            <Group gap="xs" align="center">
              <Text size="sm" fw={500}>
                Temporary Password:
              </Text>
              <Code>{response.temporaryPassword}</Code>
              <CopyButton value={response.temporaryPassword}>
                {({ copied, copy }) => (
                  <Tooltip label={copied ? "Copied" : "Copy password"}>
                    <ActionIcon
                      color={copied ? "teal" : "blue"}
                      onClick={copy}
                      size="sm"
                      variant="light"
                    >
                      {copied ? (
                        <IconCheck size={16} />
                      ) : (
                        <IconCopy size={16} />
                      )}
                    </ActionIcon>
                  </Tooltip>
                )}
              </CopyButton>
            </Group>
            <Text size="xs" c="dimmed">
              Please share this password with the patient so they can log in.
            </Text>
          </Stack>
        );

        notifications.show({
          title: "Success",
          message: notificationContent,
          color: "green",
          autoClose: false, // Don't auto-close so user can copy the password
        });
      } else {
        notifications.show({
          title: "Success",
          message: "Appointment created successfully",
          color: "green",
        });
      }

      onClose();
    } catch (error) {
      console.error("Full error object:", error);

      // Try to get more detailed error message from server response
      let errorMessage = "Failed to create appointment";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;

        // If it's about user creation failure, check for specific errors
        if (
          error.response.data.errors &&
          Array.isArray(error.response.data.errors)
        ) {
          const duplicateUserError = error.response.data.errors.find(
            (err) =>
              err.code === "DuplicateUserName" || err.code === "DuplicateEmail"
          );

          if (duplicateUserError) {
            errorMessage = `${error.response.data.message}: ${duplicateUserError.description}. Please try with a different email address.`;
          } else {
            const errorDescriptions = error.response.data.errors.map(
              (err) => err.description
            );
            errorMessage = `${
              error.response.data.message
            }: ${errorDescriptions.join(", ")}`;
          }
        }
      } else if (error.response?.data?.errors) {
        // Handle validation errors (object format)
        const validationErrors = Object.values(
          error.response.data.errors
        ).flat();
        errorMessage = validationErrors.join(", ");
      } else if (error.response?.data) {
        errorMessage = JSON.stringify(error.response.data);
      } else if (error.message) {
        errorMessage = error.message;
      }

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
        autoClose: false, // Don't auto-close error messages so user can read them
      });
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      title="Create New Appointment"
      position="right"
      size="lg"
    >
      <AppointmentForm
        onSubmit={handleCreateAppointment}
        isLoading={createAppointmentWithPatient.isPending}
      />
    </Drawer>
  );
}

export default CreateAppointmentDrawer;
