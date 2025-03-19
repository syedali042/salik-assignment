import React, { useEffect, useState } from "react";
import API from "../services/api";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [projects, setProjects] = useState([]);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    const role = localStorage.getItem("role");
    setUserRole(role);
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await API.get("/tasks/");
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error fetching tasks.");
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await API.get("/projects/");
      setProjects(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Error fetching projects.");
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/tasks/", {
        title,
        description,
        project: projectId,
      });
      setTitle("");
      setDescription("");
      setProjectId("");
      fetchTasks();
    } catch (error) {
      console.error(error);
      setErrorMsg("Error creating task.");
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/`, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error(error);
      setErrorMsg("Error updating task status.");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await API.delete(`/tasks/${taskId}/`);
      fetchTasks(); // Refresh task list after deletion
    } catch (error) {
      console.error(error);
      setErrorMsg("Error deleting task.");
    }
  };

  return (
    <div className="tasks-container">
      <h2>Tasks</h2>
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      {/* Show task creation form only for Admin */}
      {userRole === "admin" && (
        <div className="create-task">
          <h3>Create Task (Admin Only)</h3>
          <form className="task-form" onSubmit={handleCreateTask}>
            <input
              type="text"
              className="task-input"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="task-textarea"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <select
              className="task-select"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            >
              <option value="">-- Select Project --</option>
              {projects.map((proj) => (
                <option value={proj.id} key={proj.id}>
                  {proj.name}
                </option>
              ))}
            </select>
            <button type="submit" className="task-button">Create Task</button>
          </form>
        </div>
      )}

      {/* Task List */}
      <div className="task-list">
        <h3>Task List</h3>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <ul>
            {tasks.map((task) => (
              <li key={task.id} className="task-item">
                <div>
                  <strong>{task.title}</strong> – {task.description}
                </div>
                <div className="task-actions">
                  <label>Status:</label>
                  <select
                    className="task-select"
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  {userRole === "admin" && (
                    <button className="delete-button" onClick={() => handleDeleteTask(task.id)}>
                      Delete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Tasks;
