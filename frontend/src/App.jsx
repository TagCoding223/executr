import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// components import
import TopLoadingBar from './components/shared/TopLoadingBar';

// pages



// Dynamically import pages using React.lazy
const Home = lazy(() => import('./pages/Home'));
const CodeEditor = lazy(() => import('./components/CodeEditor'));

function App() {
  return (
    <div className="App">
      <Suspense fallback={<TopLoadingBar />}>
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
      </Suspense>
    </div>
  );
}

export default App;