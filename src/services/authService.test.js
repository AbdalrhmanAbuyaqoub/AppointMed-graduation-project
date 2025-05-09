import { authService } from "./authService";

// Test user credentials
const testUser = {
  email: "test@example.com",
  password: "Test123!",
  name: "Test User",
};

describe("Auth Service API Integration", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  test("API URL is configured", () => {
    expect(process.env.REACT_APP_API_URL).toBeDefined();
  });

  test("Login endpoint is accessible", async () => {
    try {
      await authService.login(testUser.email, testUser.password);
      // If we get here, the API is accessible
      expect(true).toBe(true);
    } catch (error) {
      // Log the error for debugging
      console.error("Login test failed:", error);
      throw error;
    }
  });

  test("Registration endpoint is accessible", async () => {
    try {
      await authService.register(testUser);
      expect(true).toBe(true);
    } catch (error) {
      console.error("Registration test failed:", error);
      throw error;
    }
  });

  test("Token refresh works", async () => {
    try {
      // First login to get tokens
      await authService.login(testUser.email, testUser.password);

      // Wait a bit to simulate token expiration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Try to get profile (this should trigger token refresh if needed)
      const profile = await authService.getUserProfile();
      expect(profile).toBeDefined();
    } catch (error) {
      console.error("Token refresh test failed:", error);
      throw error;
    }
  });
});
