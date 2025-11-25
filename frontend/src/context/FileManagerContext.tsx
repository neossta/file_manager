import React, { createContext, useContext, useState } from "react";
import { useFileManager } from "../hooks/useFileManeger";

interface FileManagerContextType extends ReturnType<typeof useFileManager> {
  isCreatingFolder: boolean;
  startCreatingFolder: () => void;
  cancelCreatingFolder: () => void;
  createFolder: (folderName: string) => Promise<boolean>;
}

const FileManagerContext = createContext<FileManagerContextType | null>(null);

export const FileManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const fileManager = useFileManager();
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const startCreatingFolder = () => setIsCreatingFolder(true);
  const cancelCreatingFolder = () => setIsCreatingFolder(false);
  const createFolder = async (folderName: string): Promise<boolean> => {
    const success = await fileManager.handleCreateFolder(
      fileManager.data?.path || "",
      folderName
    );
    if (success) {
      setIsCreatingFolder(false);
    }
    return success;
  };

  const contextValue: FileManagerContextType = {
    ...fileManager,
    isCreatingFolder,
    startCreatingFolder,
    cancelCreatingFolder,
    createFolder,
  };

  return (
    <FileManagerContext.Provider value={contextValue}>
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManagerContext = () => {
  const context = useContext(FileManagerContext);
  if (!context) {
    throw new Error("useFileManagerContext error");
  }
  return context;
};
