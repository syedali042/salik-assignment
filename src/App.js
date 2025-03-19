import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import AssignProject from "./pages/AssignProject";
import "./App.css";
import UserProjects from "./pages/UserProjects";
import ProjectDetail from "./pages/ProjectDetail";

// Utility function to get user role from localStorage
const getUserRole = () => localStorage.getItem("role");

// Protected route component
const AdminRoute = ({ element }) => {
  return getUserRole() === "admin" ? element : <Navigate to="/login" />;
};

const UserRoute = ({ element }) => {
  return getUserRole() ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Public and User-Accessible Routes */}
        <Route path="/" element={<UserProjects />} />
        <Route path="/projects" element={<AdminRoute element={<Projects />} />} />
        <Route path="/user-projects/:projectId" element={<UserRoute element={<ProjectDetail />} />} />

        {/* Admin-Only Routes */}
        <Route path="/tasks" element={<AdminRoute element={<Tasks />} />} />
        <Route path="/assign-project" element={<AdminRoute element={<AssignProject />} />} />
      </Routes>
    </Router>
  );
}

export default App;
