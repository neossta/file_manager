import {
  AppBar,
  Toolbar as MuiToolbar,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { ArrowBack, CreateNewFolder, Refresh } from "@mui/icons-material";
import { useFileManager } from "../hooks/useFileManeger";
import { useFileManagerContext } from "../context/FileManagerContext";

interface ToolbarProps {
  onThemeToggle: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onThemeToggle }) => {
  const { data, handleBack, refresh, loading, startCreatingFolder } =
    useFileManagerContext();

  return (
    <AppBar position="static" elevation={1}>
      <MuiToolbar>
        <IconButton
          edge="start"
          color="inherit"
          onClick={handleBack}
          disabled={!data?.path || data.path === "/"}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          File Manager
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            color="inherit"
            disabled={loading}
            onClick={startCreatingFolder}
          >
            <CreateNewFolder />
          </IconButton>
          <IconButton color="inherit" onClick={refresh} disabled={loading}>
            <Refresh />
          </IconButton>
        </Box>
      </MuiToolbar>
    </AppBar>
  );
};
