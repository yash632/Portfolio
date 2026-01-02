import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Intract from './components/Intract';
import Home from './components/Home';
import About from './components/About';
import Resume from './components/Resume';
import Contact from './components/Contact';
import Project from './components/Project';
import Admin from './components/Admin';
import AdminDashboard from './components/Admin/AdminDashboard';
import { Toaster } from "sonner";

const App = () => {
  return (
    <>
  <Toaster position="top-right" richColors />
    <Routes>
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/" element={<Intract />}>
        {/* Default route redirects to /home or renders Home directly. 
            Based on Intract links, /home is used. */}
        <Route index element={<Navigate to="/home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="resume" element={<Resume />} />
        <Route path="project" element={<Project />} />
        <Route path="contact" element={<Contact />} />
        {/* Catch all to redirect to home */}
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Route>
    </Routes>

    </>
  );
}

export default App;