import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { MainLayout } from "./layouts/MainLayout";

// Lazy load components
const Home = React.lazy(() => import("./pages/Home"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Chat = React.lazy(() => import("./pages/Chat"));
const Login = React.lazy(() => import("./pages/Login"));

// Loading fallback component
const LoadingFallback = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
    }}
  >
    Loading...
  </div>
);

export default function App() {
  return (
    <Router>
      <MantineProvider theme={theme}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            {/* Standalone pages without AppShell */}
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />

            {/* Pages with AppShell layout */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </Suspense>
      </MantineProvider>
    </Router>
  );
}
