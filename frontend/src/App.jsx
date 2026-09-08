import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

// components import
import TopLoadingBar from './components/shared/TopLoadingBar';
import Navbar from './components/shared/Navbar';

// pages



// Dynamically import pages using React.lazy
const Home = lazy(() => import('./pages/Home'));
const CodeEditor = lazy(() => import('./components/CodeEditor'));
const Auth = lazy(() => import('./pages/Auth'));
const EditorWorkspace = lazy(() => import('./pages/EditorWorkspace'));

function App() {
  return (
    <div className="App">
      <Navbar />
      <main>
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
                // <CodeEditor />
                <EditorWorkspace />
              }
            />

            <Route
              path='/auth'
              element={
                <Auth />
              }
            />
          </Routes>
        </Suspense>
      </main>

    </div>
  );
}

export default App;