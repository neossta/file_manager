import React, { createContext, useContext } from "react";
import { useFileManager } from "../hooks/useFileManeger";

const FileManagerContext = createContext<ReturnType<
  typeof useFileManager
> | null>(null);

export const FileManagerProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const fileManager = useFileManager();

  return (
    <FileManagerContext.Provider value={fileManager}>
      {children}
    </FileManagerContext.Provider>
  );
};

export const useFileManagerContext = () => {
  const context = useContext(FileManagerContext);
  if (!context) {
    throw new Error("useFileManagerContext errror");
  }
  return context;
};
