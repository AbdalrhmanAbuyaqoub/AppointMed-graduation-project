import { Modal, Text, Stack, Group, Button } from "@mantine/core";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isLoading,
}) {
  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      title={<Text fw={700}>{title}</Text>}
      centered
    >
      <Stack>
        <Text size="sm">
          Are you sure you want to delete {itemName}? This action cannot be
          undone.
        </Text>
        <Group justify="flex-end" mt="md">
          <Button variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            color="red"
            onClick={onConfirm}
            loading={isLoading}
          >
            Delete
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}

export default DeleteConfirmationModal;
