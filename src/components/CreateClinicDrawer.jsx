import { Drawer, TextInput, Button, Stack, Text, Group } from "@mantine/core";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useState } from "react";

export function CreateClinicDrawer({ opened, onClose }) {
  const [name, setName] = useState("");
  const [showError, setShowError] = useState(false);
  const { createClinic, isCreating } = useClinicQueries();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setShowError(true);
      return;
    }

    try {
      // Create the clinic
      await createClinic({ name: name.trim() });

      // Reset form and close drawer
      setName("");
      setShowError(false);
      onClose();
    } catch (error) {
      console.error("Error creating clinic:", error);
    }
  };

  const handleClose = () => {
    setName("");
    setShowError(false);
    onClose();
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      title={
        <Text fz={25} fw={600}>
          Create New Clinic
        </Text>
      }
      position="right"
      size="md"
    >
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Clinic Name"
            placeholder="Enter clinic name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (showError) setShowError(false);
            }}
            withAsterisk
            error={showError ? "Clinic name is required" : null}
            size="md"
          />

          <Group justify="flex-end" mt="xl">
            <Button variant="light" onClick={handleClose} size="md">
              Cancel
            </Button>
            <Button type="submit" loading={isCreating} size="md">
              Create Clinic
            </Button>
          </Group>
        </Stack>
      </form>
    </Drawer>
  );
}
