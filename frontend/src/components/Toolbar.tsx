import React from 'react';
import { AppBar, Toolbar as MuiToolbar, IconButton, Typography, Box } from '@mui/material';
import { ArrowBack, Refresh } from '@mui/icons-material';
import { useFileManager } from '../hooks/useFileManeger';

interface ToolbarProps {
  onThemeToggle: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onThemeToggle }) => {
  const { data, handleBack, refresh, loading } = useFileManager();

  return (
    <AppBar position="static" elevation={1}>
      <MuiToolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleBack}
          disabled={!data?.path || data.path === '/'}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          File Manager
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton color="inherit" onClick={refresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </MuiToolbar>
    </AppBar>
  );
};