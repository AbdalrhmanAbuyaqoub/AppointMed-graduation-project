import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { theme } from "./theme";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./routes.jsx";
import { useInitAuth } from "./hooks/useInitAuth";
import ErrorBoundary from "./components/ErrorBoundary";
import { LoadingOverlay } from "@mantine/core";
import { QueryProvider } from "./providers/QueryProvider";

export default function App() {
  const { isLoading } = useInitAuth();

  return (
    <QueryProvider>
      <MantineProvider theme={theme}>
        <Notifications position="bottom-right" />
        <ErrorBoundary>
          <BrowserRouter>
            <div style={{ position: "relative", minHeight: "100vh" }}>
              <LoadingOverlay visible={isLoading} />
              <AppRoutes />
            </div>
          </BrowserRouter>
        </ErrorBoundary>
      </MantineProvider>
    </QueryProvider>
  );
}
