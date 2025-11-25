import { useState, useEffect } from 'react';
import type { FilesData } from '../types/fileTypes';


export const useFileManager = () => {
  const [data, setData] = useState<FilesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (path: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = path ? `http://localhost:8000/?path=${encodeURIComponent(path)}` : 'http://localhost:8000/';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const result: FilesData = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleItemClick = (path: string) => {
    fetchData(path);
  };

  const handleBack = () => {
    if (data?.path) {
      const parentPath = data.path.split('/').slice(0, -1).join('/');
      fetchData(parentPath || '');
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/download?path=${encodeURIComponent(filePath)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  return {
    data,
    loading,
    error,
    handleItemClick,
    handleBack,
    handleDownload,
    refresh: () => fetchData(data?.path || ''),
  };
};