import { Modal, TextInput, Button, Stack, Text, Group } from "@mantine/core";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useState } from "react";
import { notifications } from "@mantine/notifications";

export function CreateClinicModal({ opened, onClose }) {
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
      await createClinic({ name: name.trim() });
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
    <Modal
      xOffset={{ m: 200 }}
      centered
      // withOverlay={false}
      overlayProps={{ opacity: 0.5 }}
      opened={opened}
      onClose={handleClose}
      title={
        <Text fz="lg" fw={700}>
          Create New Clinic
        </Text>
      }
      //   centered
      size="md"
      radius={"md"}
    >
      <form onSubmit={handleSubmit}>
        <TextInput
          //   mt={"lg"}
          labelProps={{ ml: 4, fz: "md" }}
          label="Clinic Name"
          placeholder="eg. Heart Clinic"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (showError) setShowError(false);
          }}
          withAsterisk
          error={showError ? "Clinic name is required" : null}
          size="md"
        />

        <Group justify="flex-end" mt={"xl"}>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" loading={isCreating}>
            Create Clinic
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
