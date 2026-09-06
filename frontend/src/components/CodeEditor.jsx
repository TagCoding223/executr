import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = () => {
  const [code, setCode] = useState('// Write your Java code here\n');
  const [language, setLanguage] = useState('java');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  // Handle language switching
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    // Provide a basic template when switching languages
    if (e.target.value === 'java') {
      setCode('public class Solution {\n    public void solve() {\n        \n    }\n}');
    } else if (e.target.value === 'python') {
      setCode('def solve():\n    pass');
    } else if (e.target.value === 'cpp') {
      setCode('void solve() {\n    \n}');
    }
  };

  // Handle code execution API call
  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('Executing code...');
    
    try {
      const response = await fetch('http://localhost:8080/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: language,
          sourceCode: code,
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Check for the error field first!
        if (result.error) {
          setOutput(result.error);
        } else {
          setOutput(result.output || 'Code executed successfully with no output.');
        }
      } else {
        setOutput(`Server Error: ${result.error || 'Execution failed'}`);
      }
    } catch (error) {
      setOutput(`Failed to connect to backend: ${error.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '15px' }}>
        <select value={language} onChange={handleLanguageChange}>
          <option value="java">Java</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
        </select>
        <button onClick={handleRunCode} disabled={isRunning}>
          {isRunning ? 'Running...' : 'Run Code'}
        </button>
      </div>
      
      <div style={{ flex: 1, border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden' }}>
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(value) => setCode(value)}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: 'on',
          }}
        />
      </div>

      <div style={{ height: '200px', marginTop: '20px', backgroundColor: '#1e1e1e', color: '#fff', padding: '15px', borderRadius: '4px', overflowY: 'auto', fontFamily: 'monospace' }}>
        <h3>Output:</h3>
        <pre style={{ whiteSpace: 'pre-wrap' }}>{output}</pre>
      </div>
    </div>
  );
};

export default CodeEditor;