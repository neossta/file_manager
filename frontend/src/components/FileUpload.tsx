import React, { useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  IconButton,
  Alert,
  Button,
} from "@mui/material";
import { CloudUpload, Close, InsertDriveFile } from "@mui/icons-material";

interface FileUploadProps {
  onUploadComplete: () => void;
  currentPath: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  currentPath,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 1) {
      setError("Можно загружать только один файл");
      return;
    }

    if (files.length === 1) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files.length > 0) {
      if (e.target.files.length > 1) {
        setError("Можно загружать только один файл");
        return;
      }
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setProgress(0);
    setError(null);

    try {
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      await uploadFile(selectedFile);

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setSelectedFile(null);
        setUploading(false);
        setProgress(0);
        onUploadComplete();
      }, 500);
    } catch (error) {
      setUploading(false);
      setProgress(0);
      setError(error instanceof Error ? error.message : "Ошибка загрузки");
    }
  };

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", currentPath);

    const response = await fetch("http://localhost:8000/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.error || `Upload failed: ${response.statusText}`
      );
    }

    return response.json();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <Box sx={{ mb: 2 }}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        style={{ display: "none" }}
      />

      <Paper
        sx={{
          p: 3,
          border: "2px dashed",
          borderColor: isDragOver ? "primary.main" : "grey.300",
          backgroundColor: isDragOver ? "action.hover" : "background.paper",
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.3s ease",
          opacity: uploading ? 0.6 : 1,
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={uploading ? undefined : openFileDialog}
      >
        <CloudUpload sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
        <Typography variant="h6" gutterBottom>
          Перетащите файл сюда
        </Typography>
        <Typography variant="body2" color="text.secondary">
          или нажмите для выбора файла
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {selectedFile && !uploading && (
        <Box
          sx={{
            mt: 2,
            p: 2,
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <InsertDriveFile color="primary" />
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="body1" fontWeight="medium">
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
            <IconButton onClick={removeFile} color="error">
              <Close />
            </IconButton>
          </Box>

          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <Button
              onClick={handleUpload}
              variant="contained"
              color="primary"
              startIcon={<CloudUpload />}
              sx={{
                flexShrink: 0,
                minWidth: "120px",
              }}
            >
              Загрузить
            </Button>
          </Box>
        </Box>
      )}

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
            <InsertDriveFile color="primary" />
            <Typography variant="body2" noWrap sx={{ flexGrow: 1 }}>
              {selectedFile?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {Math.round(progress)}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
      )}
    </Box>
  );
};
