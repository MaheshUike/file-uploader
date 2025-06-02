import React, { useState } from 'react';
import FileUpload from './component/fileUpload';
import './App.css';

const App: React.FC = () => {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  const toggleMode = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`app ${mode}`}>
      <button onClick={toggleMode} className="mode-toggle">
        Toggle to {mode === 'light' ? 'Dark' : 'Light'} Mode
      </button>
      <FileUpload mode={mode} />
    </div>
  );
};

export default App;