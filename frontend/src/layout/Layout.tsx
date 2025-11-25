import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { darkTheme, lightTheme } from "../theme/theme";
import { Toolbar } from "../components/Toolbar";
import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onThemeToggle: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  darkMode,
  onThemeToggle,
}) => {
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: {
            xs: "85vh",
            sm: "90vh",
          },
          minWidth: {
            xs: "100vw",
            sm: "65vw",
          },
          margin: "0 auto",
        }}
      >
        <Toolbar onThemeToggle={onThemeToggle} />
        <Box sx={{ flex: 1, overflow: "hidden" }}>{children}</Box>
        <Box
          sx={{
            position: "fixed",
            top: { xs: 5, sm: 16 },
            right: 16,
          }}
        >
          <ThemeToggle darkMode={darkMode} onToggle={onThemeToggle} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};
