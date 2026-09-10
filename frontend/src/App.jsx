import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { PrivateRoute, PublicRoute } from './components/RouteGuards';

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
        {/* Strictly Public Routes (Only accessible when logged OUT) */}
        <Route element={<PublicRoute />}>
          <Route path="/auth" element={<Auth />} />
        </Route>

        {/* Routes with the Global Navbar */}
        <Route element={<MainLayout />}>
          {/* Accessible to anyone */}
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<Problems />} />
          
          {/* Accessible ONLY when logged IN */}
          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/playground" element={<EditorWorkspace mode="playground" />} />
          <Route path="/problem/:id" element={<EditorWorkspace mode="problem" />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;