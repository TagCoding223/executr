import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';


// pages



// Dynamically import pages using React.lazy
const Home = lazy(() => import('./pages/Home'));
const CodeEditor = lazy(() => import('./components/CodeEditor'));

function App() {
  return (
    <div className="App">
      <Routes>
        <Route 
          path='/'
          element={
            <Home />
          }
        />

        <Route 
          path='/editor'
          element={
            <CodeEditor />
          }
        />
      </Routes>
    </div>
  );
}

export default App;