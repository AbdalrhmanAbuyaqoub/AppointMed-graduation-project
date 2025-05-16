import { createTheme } from "@mantine/core";

export const theme = createTheme({
  fontFamily: "inter",
  primaryColor: "violet",
  backgroundColor: "#fafafa",
  headings: {
    fontFamily: "Open Sans",
  },
  black: "#0a2540",
  defaultProps: {
    Text: {
      c: "#0a2540",
    },
  },
  components: {
    Text: {
      styles: {
        root: {
          color: "#0a2540",
        },
      },
    },
  },
  shadows: {
    xs: "0 1px 3px rgba(0, 0, 0, 0.05)",
    sm: "0 1px 7px rgba(0, 0, 0, 0.08)",
    md: "0 5px 15px rgba(0, 0, 0, 0.1)",
    lg: "0 8px 20px rgba(0, 0, 0, 0.12)",
    xl: "0 12px 30px rgba(0, 0, 0, 0.14)",
  },
});
