import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { BrowserRouter as Router } from "react-router-dom";
import { AppRoutes } from "./routes.jsx";
import { AuthProvider } from "./context/AuthContext";
import ErrorBoundary from "./components/ErrorBoundary";

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <ErrorBoundary>
        <Router>
          <AuthProvider>
            <AppRoutes />
          </AuthProvider>
        </Router>
      </ErrorBoundary>
    </MantineProvider>
  );
}
