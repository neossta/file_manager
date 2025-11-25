import React, { useState } from "react";
import {
  Box,
  List,
  CircularProgress,
  Alert,
  Paper,
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  TextField,
  IconButton,
} from "@mui/material";
import {
  Folder as FolderIcon,
  CreateNewFolder,
  Check,
  Close,
} from "@mui/icons-material";
import { useFileManagerContext } from "../context/FileManagerContext";
import { Breadcrumb } from "./Breadcrumps";
import { FileItem } from "./Item";

export const FileManager: React.FC = () => {
  const {
    data,
    loading,
    error,
    handleItemClick,
    handleDownload,
    refresh,
    handleRename,
    handleDelete,
    createFolder,
    isCreatingFolder,
    cancelCreatingFolder,
  } = useFileManagerContext();

  const [newFolderName, setNewFolderName] = useState("");
  const [isInvalidName, setIsInvalidName] = useState(false);

  const handleEditClick = async (oldPath: string, newName: string) => {
    console.log("rename:", oldPath, "to", newName);
    await handleRename(oldPath, newName);
  };

  const handleBreadcrumbClick = (path: string) => {
    handleItemClick(path);
  };

  const handleCreateFolderSave = async () => {
    if (newFolderName && !isInvalidName) {
      const success = await createFolder(newFolderName);
      if (success) {
        setNewFolderName("");
      }
    }
  };

  const handleCreateFolderCancel = () => {
    cancelCreatingFolder();
    setNewFolderName("");
    setIsInvalidName(false);
  };

  const handleNewFolderNameChange = (value: string) => {
    const invalid =
      value.includes("/") || value.includes("\\") || value.trim() === "";
    setIsInvalidName(invalid);
    setNewFolderName(value);
  };

  const handleNewFolderKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isInvalidName) {
      handleCreateFolderSave();
    } else if (e.key === "Escape") {
      handleCreateFolderCancel();
    }
  };

  if (loading && !data) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!data) {
    return (
      <Alert severity="info" sx={{ m: 2 }}>
        Нет данных
      </Alert>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Breadcrumb onPathClick={handleBreadcrumbClick} />{" "}
      <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
        {isCreatingFolder && (
          <ListItem
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              mb: 1,
              backgroundColor: "action.hover",
              alignItems: "center",
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, my: "auto" }}>
              <FolderIcon color="primary" />
            </ListItemIcon>

            <ListItemText
              primary={
                <Tooltip
                  title="Имя папки не может содержать символы / или \"
                  open={isInvalidName}
                  arrow
                  placement="top"
                >
                  <TextField
                    value={newFolderName}
                    onChange={(e) => handleNewFolderNameChange(e.target.value)}
                    onKeyDown={handleNewFolderKeyPress}
                    size="small"
                    autoFocus
                    fullWidth
                    error={isInvalidName}
                    placeholder="Введите имя папки"
                    sx={{
                      my: "auto",
                      "& .MuiInputBase-root": {
                        height: "40px",
                        overflow: "hidden",
                      },
                      "& .MuiInputBase-input": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      },
                    }}
                  />
                </Tooltip>
              }
              sx={{
                flex: 1,
                my: "auto",
              }}
            />

            <Box sx={{ display: "flex", gap: 1, my: "auto", ml: 3 }}>
              <IconButton
                size="small"
                onClick={handleCreateFolderSave}
                color="primary"
                disabled={isInvalidName || !newFolderName.trim()}
              >
                <Check />
              </IconButton>
              <IconButton
                size="small"
                onClick={handleCreateFolderCancel}
                color="error"
              >
                <Close />
              </IconButton>
            </Box>
          </ListItem>
        )}

        {data.files.length === 0 && !isCreatingFolder ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            В этой папке пока нет файлов
          </Typography>
        ) : (
          <List>
            {data.files.map((item, index) => (
              <FileItem
                key={`${item.name}-${index}`}
                item={item}
                currentPath={data.path}
                onItemClick={handleItemClick}
                onDownload={handleDownload}
                onRename={handleEditClick}
                onDelete={handleDelete}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};
