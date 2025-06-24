import React from "react";
import { Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import Profile from "../pages/Profile";

function ProfileModal() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <Modal
      radius="lg"
      opened={true}
      onClose={handleClose}
      size="xl"
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
    >
      <Profile isModal={true} onClose={handleClose} />
    </Modal>
  );
}

export default ProfileModal;
