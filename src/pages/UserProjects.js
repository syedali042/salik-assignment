import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function UserProjects() {
  const [projects, setProjects] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  // Wrap fetchUserProjects with useCallback to prevent re-creation on re-renders
  const fetchUserProjects = useCallback(async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem("accessToken");

      // If no token found, redirect to login
      if (!token) {
        setErrorMsg("You are not authenticated. Please log in.");
        navigate("/login");
        return;
      }

      // Fetch projects with authorization header
      const response = await API.get("/projects/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProjects(response.data);
    } catch (error) {
      console.error("API Error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          setErrorMsg("Session expired. Please log in again.");
          localStorage.removeItem("accessToken"); // Remove old token
          navigate("/login");
        } else {
          setErrorMsg("Failed to fetch projects.");
        }
      } else {
        setErrorMsg("Network error. Please check your connection.");
      }
    }
  }, [navigate]); // Include `navigate` in dependencies to prevent eslint warning

  // useEffect now correctly includes the dependency
  useEffect(() => {
    fetchUserProjects();
  }, [fetchUserProjects]);

  const handleProjectClick = (projectId) => {
    navigate(`/user-projects/${projectId}`);
  };

  return (
    <div className="user-projects-container">
      <h2 className="projects-title">My Projects</h2>
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      <div className="projects-list">
        {projects.length === 0 ? (
          <p>No projects assigned.</p>
        ) : (
          projects.map((proj, idx) => (
            <div
              key={proj.id}
              className="project-card"
              onClick={() => handleProjectClick(proj.id)}
            >
              <h3>{idx + 1}) {proj.name}</h3>
              <p>{proj.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default UserProjects;
