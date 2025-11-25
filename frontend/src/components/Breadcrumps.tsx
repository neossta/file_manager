import React from "react";
import { Breadcrumbs, Link, Typography, Box } from "@mui/material";
import { NavigateNext, Home } from "@mui/icons-material";
import type { FilesData } from "../types/fileTypes";
import { useFileManagerContext } from "../context/FileManagerContext";

interface BreadcrumbProps {
  onPathClick: (path: string) => void;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ onPathClick }) => {
  const { data } = useFileManagerContext();
  if (!data) return null;

  const pathParts = data.path.split("/").filter((part) => part !== "");

  const handleBreadcrumbClick = (index: number) => {
    const path = pathParts.slice(0, index + 1).join("/");
    onPathClick(path);
  };

  const handleHomeClick = () => {
    onPathClick("");
  };

  return (
    <Box sx={{ p: 2, pb: 1 }}>
      <Breadcrumbs
        separator={<NavigateNext fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          component="button"
          onClick={handleHomeClick}
          sx={{
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
            textDecoration: "none",
            border: "none",
            background: "none",
          }}
        >
          <Home sx={{ mr: 0.5 }} fontSize="small" />
          Home
        </Link>
        {pathParts.map((part, index) => (
          <Link
            key={index}
            component="button"
            onClick={() => handleBreadcrumbClick(index)}
            sx={{
              cursor: "pointer",
              textDecoration: "none",
              border: "none",
              background: "none",
              font: "inherit",
              color: "inherit",
            }}
          >
            {part}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  );
};
