import React from 'react';
import {
  Box,
  List,
  CircularProgress,
  Alert,
  Paper,
  Typography,
} from '@mui/material';
import { useFileManager } from '../hooks/useFileManeger';
import { Breadcrumb } from './Breadcrumps';
import { FileItem } from './Item';


export const FileManager: React.FC = () => {
  const {
    data,
    loading,
    error,
    handleItemClick,
    handleDownload,
    refresh,
  } = useFileManager();

  const handleRename = async (oldPath: string, newName: string) => {
    // TODO: Implement rename API call
    console.log('Rename:', oldPath, 'to', newName);
    refresh();
  };

  if (loading && !data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
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
        No data available
      </Alert>
    );
  }

  return (
    <Paper elevation={0} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Breadcrumb />
      
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {data.files.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            This folder is empty
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
                onRename={handleRename}
              />
            ))}
          </List>
        )}
      </Box>
    </Paper>
  );
};