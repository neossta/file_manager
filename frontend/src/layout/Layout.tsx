import React from 'react';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import { darkTheme, lightTheme } from '../theme/theme';
import { Toolbar } from '../components/Toolbar';
import { ThemeToggle } from './ThemeToggle';


interface LayoutProps {
  children: React.ReactNode;
  darkMode: boolean;
  onThemeToggle: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, darkMode, onThemeToggle }) => {
  const theme = darkMode ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <Toolbar onThemeToggle={onThemeToggle} />
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {children}
        </Box>
        <Box
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <ThemeToggle darkMode={darkMode} onToggle={onThemeToggle} />
        </Box>
      </Box>
    </ThemeProvider>
  );
};