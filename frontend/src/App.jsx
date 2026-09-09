import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

// components import
import TopLoadingBar from './components/shared/TopLoadingBar';
import Navbar from './components/shared/Navbar';

// pages



// Dynamically import pages using React.lazy
const Home = lazy(() => import('./pages/Home'));
const CodeEditor = lazy(() => import('./components/CodeEditor'));
const Auth = lazy(() => import('./pages/Auth'));
const EditorWorkspace = lazy(() => import('./pages/EditorWorkspace'));
const Problems = lazy(() => import('./pages/Problems'));
const Profile = lazy(() => import('./pages/Profile'));

// Layout component for pages that require the standard Navbar
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet /> {/* This is where the nested routes will render */}
    </>
  );
};

function App() {
  return (

    <Suspense fallback={<TopLoadingBar />}>
      <Routes>
        {/* Routes with the Global Navbar */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          <Route path="/profile" element={<Profile />} />

          {/* Playground Mode (No problem description) */}
          <Route
            path="/playground"
            element={<EditorWorkspace mode="playground" />}
          />

          {/* Problem Solving Mode (Includes description panel) */}
          <Route
            path="/problem/:id"
            element={<EditorWorkspace mode="problem" />}
          />
        </Route>

        {/* Full-Screen Routes (No standard Navbar) */}
        <Route path="/auth" element={<Auth />} />


      </Routes>
    </Suspense>
  );
}

export default App;