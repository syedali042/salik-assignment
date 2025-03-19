import React, { useEffect, useState } from "react";
import API from "../services/api";

function AssignProject() {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchProjects();
    fetchUsers();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to fetch projects.");
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users/");
      const normalUsers = response.data.filter((u) => u.role === "user");
      setUsers(normalUsers);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to fetch users.");
    }
  };

  const handleSelectUsers = (e) => {
    const options = Array.from(e.target.selectedOptions);
    const values = options.map((opt) => opt.value);
    setSelectedUsers(values);
  };

  const handleAssign = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!selectedProject) return setErrorMsg("Please select a project.");
    if (selectedUsers.length === 0) return setErrorMsg("Please select at least one user.");

    try {
      await API.patch(`/projects/${selectedProject}/`, {
        assigned_users: selectedUsers.map(Number),
      });
      setSuccessMsg("Project assigned successfully!");
      fetchProjects();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to assign users to the project.");
    }
  };

  return (
    <div className="assign-project-container">
      <h2>Assign Project to Users (Admin Only)</h2>
      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}

      <div className="form-group">
        <label>Project:</label>
        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="assign-select"
        >
          <option value="">-- Select Project --</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name} (Assigned: {proj.assigned_users?.length ? proj.assigned_users.join(", ") : "None"})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Users:</label>
        <select
          multiple
          value={selectedUsers}
          onChange={handleSelectUsers}
          className="assign-multi-select"
        >
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      <button onClick={handleAssign} className="assign-button">Assign</button>
    </div>
  );
}

export default AssignProject;
