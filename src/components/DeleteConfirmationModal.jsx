import { Modal, Text, Stack, Group, Button } from "@mantine/core";

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  itemName,
  isLoading,
  additionalMessage,
}) {
  return (
    <Modal
      radius="md"
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
        {additionalMessage && (
          <Text size="sm" c="dimmed">
            {additionalMessage}
          </Text>
        )}
        <Group justify="flex-end" mt="md">
          <Button radius="md" variant="light" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="outline"
            color="red"
            radius="md"
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
