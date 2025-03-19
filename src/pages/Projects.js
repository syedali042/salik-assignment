import React, { useEffect, useState } from "react";
import API from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [userRole, setUserRole] = useState(null);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error fetching projects.");
    }
  };

  useEffect(() => {
    fetchProjects();

    // Get user role from localStorage
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await API.post("/projects/", {
        name,
        description,
      });
      setName("");
      setDescription("");
      fetchProjects(); // Refresh the list
    } catch (error) {
      console.error(error);
      setErrorMsg("Error creating project.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await API.delete(`/projects/${projectId}/`);
      fetchProjects(); // Refresh project list after deletion
    } catch (error) {
      console.error(error);
      setErrorMsg("Error deleting project.");
    }
  };

  return (
    <div className="projects-container">
      <h2>Projects</h2>
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      {/* Show project creation form only for admins */}
      {userRole === "admin" && (
        <div className="create-project">
          <h3>Create New Project (Admin Only)</h3>
          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button type="submit">Create Project</button>
          </form>
        </div>
      )}

      <div className="project-list">
        <h3>Project List</h3>
        <ul>
          {projects.map((project) => (
            <li key={project.id} className="project-item">
              <div>
                <strong>{project.name}</strong> - {project.description}
              </div>
              {userRole === "admin" && (
                <button
                  className="delete-button"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Projects;
