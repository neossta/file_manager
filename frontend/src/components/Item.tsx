import React, { useState } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  TextField,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Folder as FolderIcon,
  InsertDriveFile as FileIcon,
  Download as DownloadIcon,
  Edit as EditIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import type { FileData } from "../types/fileTypes";

interface FileItemProps {
  item: FileData;
  currentPath: string;
  onItemClick: (path: string) => void;
  onDownload: (filePath: string, fileName: string) => void;
  onRename: (oldPath: string, newName: string) => void;
  onDelete: (path: string) => Promise<boolean>;
}

export const FileItem: React.FC<FileItemProps> = ({
  item,
  currentPath,
  onItemClick,
  onDownload,
  onRename,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(item.name);
  const [isInvalidName, setIsInvalidName] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fullPath = `${currentPath}/${item.name}`;

  const handleItemClick = () => {
    if (item.dir && !isEditing) {
      onItemClick(`${currentPath}/${item.name}`);
    }
  };

  const handleEditStart = () => {
    setIsEditing(true);
    setEditName(item.name);
  };

  const handleEditSave = () => {
    if (editName && editName !== item.name) {
      onRename(`${currentPath}/${item.name}`, editName);
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditName(item.name);
    setIsEditing(false);
    setIsInvalidName(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isInvalidName) {
      handleEditSave();
    } else if (e.key === "Escape") {
      handleEditCancel();
    }
  };

  const handleOnChange = (value: string) => {
    if (value.includes("/") || value.includes("\\")) {
      setIsInvalidName(true);
    } else {
      setIsInvalidName(false);
    }
    setEditName(value);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(fullPath);
    } catch (error) {
      console.error("delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <ListItem
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        mb: 1,
        "&:hover": {
          backgroundColor: "action.hover",
        },
      }}
    >
      <ListItemIcon sx={{ minWidth: 40 }} onClick={handleItemClick}>
        {item.dir ? (
          <FolderIcon color="primary" />
        ) : (
          <FileIcon color="action" />
        )}
      </ListItemIcon>

      <ListItemText
        primary={
          isEditing ? (
            <Tooltip
              title="Имя не должно содержать символы / и \"
              open={isInvalidName}
              arrow
              placement="top"
            >
              <TextField
                value={editName}
                onChange={(e) => handleOnChange(e.target.value)}
                onKeyDown={handleKeyPress}
                size="small"
                autoFocus
                fullWidth
                error={isInvalidName}
              />
            </Tooltip>
          ) : (
            <Typography
              onClick={handleItemClick}
              sx={{
                cursor: item.dir ? "pointer" : "default",
                "&:hover": item.dir ? { textDecoration: "underline" } : {},
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                maxWidth: "100%",
                display: "block",
              }}
            >
              {item.name}
            </Typography>
          )
        }
        secondary={
          !item.dir &&
          !isEditing && (
            <Typography variant="body2" color="text.secondary">
              {(item.size / 1024).toFixed(2)} KB
            </Typography>
          )
        }
        sx={{ flex: 1 }}
      />

      <Box sx={{ display: "flex", gap: 1, ml: 3 }}>
        {isEditing ? (
          <>
            <IconButton
              size="small"
              onClick={handleEditSave}
              color="primary"
              disabled={isInvalidName}
            >
              <CheckIcon />
            </IconButton>
            <IconButton size="small" onClick={handleEditCancel} color="error">
              <CloseIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton size="small" onClick={handleEditStart} color="primary">
              <EditIcon />
            </IconButton>
            {!item.dir && (
              <IconButton
                size="small"
                onClick={() => onDownload(fullPath, item.name)}
                color="primary"
              >
                <DownloadIcon />
              </IconButton>
            )}
            <IconButton
              size="small"
              onClick={handleDelete}
              color="default"
              disabled={isDeleting}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Box>
    </ListItem>
  );
};
