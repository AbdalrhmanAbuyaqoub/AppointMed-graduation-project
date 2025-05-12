import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme";
import App from "./App";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <MantineProvider theme={theme} defaultColorScheme="light">
    <App />
  </MantineProvider>
  // </React.StrictMode>
);
