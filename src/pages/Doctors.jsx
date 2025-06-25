import {
  Container,
  Divider,
  Title,
  Group,
  Paper,
  Button,
  Stack,
  Modal,
  Text,
} from "@mantine/core";
import { IconPlus, IconBuildingHospital } from "@tabler/icons-react";
import { useState } from "react";
import { DoctorsTable } from "../components/DoctorsTable";
import CreateDoctorDrawer from "../components/CreateDoctorDrawer";
import { useClinicQueries } from "../hooks/useClinicQueries";
import { useNavigate } from "react-router-dom";
import { theme } from "../theme";
import useSearchStore from "../store/useSearchStore";

export default function Doctors() {
  const [createDrawerOpened, setCreateDrawerOpened] = useState(false);
  const [noClinicModalOpened, setNoClinicModalOpened] = useState(false);
  const { searchQuery } = useSearchStore();
  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    selectedClinic: "",
  });
  const { clinics, addDoctor, isAddingDoctor } = useClinicQueries();
  const navigate = useNavigate();

  const handleAddDoctorClick = () => {
    if (!clinics || clinics.length === 0) {
      setNoClinicModalOpened(true);
    } else {
      setCreateDrawerOpened(true);
    }
  };

  const handleSubmit = async () => {
    if (!doctorData.firstName.trim()) {
      return;
    }
    if (!doctorData.lastName.trim()) {
      return;
    }
    if (!doctorData.email.trim()) {
      return;
    }
    if (!doctorData.phoneNumber.trim()) {
      return;
    }

    try {
      await addDoctor({
        clinicId: parseInt(doctorData.selectedClinic),
        firstName: doctorData.firstName.trim(),
        lastName: doctorData.lastName.trim(),
        email: doctorData.email.trim(),
        address: doctorData.address.trim(),
        phoneNumber: doctorData.phoneNumber.trim(),
      });

      setDoctorData({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        phoneNumber: "",
        selectedClinic: "",
      });
      setCreateDrawerOpened(false);
    } catch (error) {
      console.error("Error adding doctor:", error);
    }
  };

  return (
    <Container pt={12} maw={1232} fluid>
      <Modal
        title={
          <Text fz={"lg"} fw={700}>
            There is no Clinics
          </Text>
        }
        radius={"md"}
        closeButtonProps={{ radius: "xl" }}
        centered
        opened={noClinicModalOpened}
        onClose={() => setNoClinicModalOpened(false)}
        size="md"
      >
        <Text fz={"sm"}>
          You must create at least one clinic before adding a doctor.
        </Text>

        <Group justify="end" mt="xl">
          <Button
            variant="outline"
            onClick={() => setNoClinicModalOpened(false)}
          >
            Cancel
          </Button>
          <Button
            bg={theme.primaryColor}
            variant="filled"
            onClick={() => navigate("/clinics")}
          >
            Go to Clinics
          </Button>
        </Group>
      </Modal>

      <Stack>
        <Title fz={"24px"} order={2}>
          Doctors
        </Title>
        <Group mt={40} justify="flex-end">
          <Button
            size="lg"
            variant="outline"
            leftSection={<IconPlus size={20} />}
            onClick={handleAddDoctorClick}
            radius="xl"
          >
            New Doctor
          </Button>
        </Group>

        <Paper radius={"md"} withBorder>
          <DoctorsTable searchQuery={searchQuery} />
        </Paper>

        <CreateDoctorDrawer
          opened={createDrawerOpened}
          onClose={() => setCreateDrawerOpened(false)}
          onSubmit={handleSubmit}
          doctorData={doctorData}
          setDoctorData={setDoctorData}
          isLoading={isAddingDoctor}
        />
      </Stack>
    </Container>
  );
}
