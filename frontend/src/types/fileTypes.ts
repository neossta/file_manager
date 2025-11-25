export interface FilesData {
  path: string;
  result: boolean;
  files: FileData[];
}

export interface FileData {
  name: string;
  dir: boolean;
  size: number;
}