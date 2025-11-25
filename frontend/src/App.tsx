import React, { useState } from 'react';
import './App.css';
import { FileManager } from './components/FileManager';
import { Layout } from './layout/Layout';

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  return (
    <Layout darkMode={darkMode} onThemeToggle={handleThemeToggle}>
      <FileManager />
    </Layout>
  );
}

export default App;