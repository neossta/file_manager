import { useState, useEffect } from "react";
import type { FilesData } from "../types/fileTypes";

export const useFileManager = () => {
  const [data, setData] = useState<FilesData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (path: string = "") => {
    setLoading(true);
    setError(null);
    try {
      const url = path
        ? `http://localhost:8000/?path=${encodeURIComponent(path)}`
        : "http://localhost:8000/";
      const response = await fetch(url);
      if (!response.ok) throw new Error("Ошибка при загрузке данных");
      const result: FilesData = await response.json();
      setData(result);
      console.log(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ошибка при загрузке данных"
      );
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
      const parentPath = data.path.split("/").slice(0, -1).join("/");
      fetchData(parentPath || "");
    }
  };
  const handleRename = async (
    oldPath: string,
    newName: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(
        `http://localhost:8000/rename?oldPath=${encodeURIComponent(
          oldPath
        )}&newName=${encodeURIComponent(newName)}`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Ошибка при изменение имени файла");
      }

      const result = await response.json();

      if (result.result) {
        await fetchData(data?.path || "");
        return true;
      } else {
        throw new Error(result.error || "Ошибка при загрузке данных");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Rename failed";
      setError(errorMessage);
      console.error("Rename error:", errorMessage);
      return false;
    }
  };

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const response = await fetch(
        `http://localhost:8000/download?path=${encodeURIComponent(filePath)}`
      );
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Ошибка при загрузке файла:", err);
    }
  };

  return {
    data,
    loading,
    error,
    handleItemClick,
    handleBack,
    handleDownload,
    handleRename,
    refresh: () => fetchData(data?.path || ""),
  };
};
