import React, { lazy, Suspense } from "react";
import { Modal } from "@mantine/core";
import { useNavigate } from "react-router-dom";

const Profile = lazy(() => import("../pages/Profile"));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Profile isModal={true} onClose={handleClose} />
      </Suspense>
    </Modal>
  );
}

export default ProfileModal;
