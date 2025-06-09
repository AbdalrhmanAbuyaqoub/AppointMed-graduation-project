import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { theme } from "./theme";
import App from "./App";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <MantineProvider theme={theme} defaultColorScheme="light">
    <DatesProvider>
      <App />
    </DatesProvider>
  </MantineProvider>
  // </React.StrictMode>
);
