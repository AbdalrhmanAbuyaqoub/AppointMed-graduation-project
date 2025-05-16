import { notifications } from "@mantine/notifications";

class NotificationService {
  static success(title, message) {
    console.log("NotificationService: Showing success notification", {
      title,
      message,
    });
    notifications.show({
      title,
      message,
      color: "green",
      autoClose: 5000,
      withBorder: true,
      withCloseButton: true,
    });
  }

  static error(title, message) {
    console.log("NotificationService: Showing error notification", {
      title,
      message,
    });
    notifications.show({
      title,
      message,
      color: "red",
      autoClose: 5000,
      withBorder: true,
      withCloseButton: true,
    });
  }

  static info(title, message) {
    console.log("NotificationService: Showing info notification", {
      title,
      message,
    });
    notifications.show({
      title,
      message,
      color: "blue",
      autoClose: 5000,
      withBorder: true,
      withCloseButton: true,
    });
  }

  static warning(title, message) {
    console.log("NotificationService: Showing warning notification", {
      title,
      message,
    });
    notifications.show({
      title,
      message,
      color: "yellow",
      autoClose: 5000,
      withBorder: true,
      withCloseButton: true,
    });
  }

  // Add a test method
  static test() {
    console.log("NotificationService: Running test notification");
    this.info(
      "Test Notification",
      "This is a test notification to verify the service is working."
    );
  }
}

export default NotificationService;
