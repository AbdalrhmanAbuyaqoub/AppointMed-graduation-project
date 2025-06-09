import {
  Drawer,
  TextInput,
  Button,
  Stack,
  Text,
  Group,
  Select,
} from "@mantine/core";
import { useDoctorQueries } from "../hooks/useDoctorQueries";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useState } from "react";
import NotificationService from "../services/NotificationService";

function CreateDoctorDrawer({
  opened,
  onClose,
  onSubmit,
  doctorData,
  setDoctorData,
  isLoading,
  clinicId,
}) {
  const { createDoctor, isCreating } = useDoctorQueries();
  const { clinics } = useClinicQueries();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (
      !doctorData.firstName.trim() ||
      !doctorData.lastName.trim() ||
      !doctorData.email.trim() ||
      !doctorData.phoneNumber.trim()
    ) {
      return;
    }

    try {
      await createDoctor({
        clinicId: clinicId || parseInt(doctorData.selectedClinic),
        firstName: doctorData.firstName.trim(),
        lastName: doctorData.lastName.trim(),
        email: doctorData.email.trim(),
        address: doctorData.address.trim(),
        phoneNumber: doctorData.phoneNumber.trim(),
      });

      // Reset form and close drawer
      setDoctorData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phoneNumber: "",
        selectedClinic: clinicId ? clinicId.toString() : "",
      });
      onClose();

      NotificationService.success("Success", "Doctor added successfully");
    } catch (error) {
      console.error("Error creating doctor:", error);
      NotificationService.error(
        "Error",
        error.message || "Failed to add doctor"
      );
    }
  };

  return (
    <Drawer
      withOverlay={false}
      opened={opened}
      onClose={onClose}
      title={
        <Text fz={25} fw={600}>
          Add New Doctor
        </Text>
      }
      position="right"
      size="md"
    >
      <Stack gap="md" p="md">
        <TextInput
          label="First Name"
          placeholder="Doctor First Name"
          required
          value={doctorData.firstName}
          onChange={(e) =>
            setDoctorData((prev) => ({
              ...prev,
              firstName: e.target.value,
            }))
          }
        />
        <TextInput
          label="Last Name"
          placeholder="Doctor Last Name"
          required
          value={doctorData.lastName}
          onChange={(e) =>
            setDoctorData((prev) => ({
              ...prev,
              lastName: e.target.value,
            }))
          }
        />
        <TextInput
          label="Email"
          type="email"
          placeholder="Doctor Email"
          required
          value={doctorData.email}
          onChange={(e) =>
            setDoctorData((prev) => ({
              ...prev,
              email: e.target.value,
            }))
          }
        />
        <TextInput
          label="Phone Number"
          placeholder="Doctor Phone"
          required
          value={doctorData.phoneNumber}
          onChange={(e) =>
            setDoctorData((prev) => ({
              ...prev,
              phoneNumber: e.target.value,
            }))
          }
        />
        <TextInput
          label="Address"
          placeholder="Doctor Address"
          value={doctorData.address}
          onChange={(e) =>
            setDoctorData((prev) => ({
              ...prev,
              address: e.target.value,
            }))
          }
        />
        <Select
          label="Select Clinic"
          placeholder="Choose a clinic"
          data={clinics.map((clinic) => ({
            value: clinic.id.toString(),
            label: clinic.name,
          }))}
          value={clinicId ? clinicId.toString() : doctorData.selectedClinic}
          onChange={(value) =>
            setDoctorData((prev) => ({
              ...prev,
              selectedClinic: value,
            }))
          }
          disabled={!!clinicId}
          withAsterisk
          error={
            !clinicId && !doctorData.selectedClinic
              ? "Please select a clinic"
              : null
          }
          size="md"
        />
        <Group justify="flex-end" mt="xl">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="filled" onClick={handleSubmit} loading={isLoading}>
            Add Doctor
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}

export default CreateDoctorDrawer;
