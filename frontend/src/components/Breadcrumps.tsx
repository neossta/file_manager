import React from 'react';
import { Breadcrumbs, Link, Typography, Box } from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { useFileManager } from '../hooks/useFileManeger';


export const Breadcrumb: React.FC = () => {
  const { data, handleItemClick } = useFileManager();

  if (!data) return null;

  const pathParts: string[] = data.path.split('/').filter(part => part !== '');

  const handleBreadcrumbClick = (index: number) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    handleItemClick(path);
  };

  return (
    <Box sx={{ p: 2, pb: 1 }}>
      <Breadcrumbs separator={<NavigateNext fontSize="small" />} aria-label="breadcrumb">
        <Link
          component="button"
          onClick={() => handleItemClick('')}
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            cursor: 'pointer',
            textDecoration: 'none'
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
              cursor: 'pointer',
              textDecoration: 'none'
            }}
          >
            {part}
          </Link>
        ))}
      </Breadcrumbs>
    </Box>
  );
};