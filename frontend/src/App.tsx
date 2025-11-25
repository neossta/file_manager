import { useState } from "react";
import "./App.css";
import { FileManager } from "./components/FileManager";
import { Layout } from "./layout/Layout";
import { FileManagerProvider } from "./context/FileManagerContext";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <FileManagerProvider>
      <Layout darkMode={darkMode} onThemeToggle={handleThemeToggle}>
        <FileManager />
      </Layout>
    </FileManagerProvider>
  );
}

export default App;
