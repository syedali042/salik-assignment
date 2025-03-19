/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function ProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
    fetchUserTasks();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await API.get(`/projects/${projectId}/`);
      setProject(response.data);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to fetch project details.");
    }
  };

  const fetchUserTasks = async () => {
    try {
      const response = await API.get("/tasks/");
      const allUserTasks = response.data;
      const projectTasks = allUserTasks.filter((task) => task.project === Number(projectId));
      setTasks(projectTasks);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await API.patch(`/tasks/${taskId}/`, { status: newStatus });
      fetchUserTasks();
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to update task status.");
    }
  };

  return (
    <div className="project-detail-container">
      <h2>Project Detail</h2>
      {errorMsg && <p className="error-message">{errorMsg}</p>}

      {project ? (
        <>
          <h3>{project.name}</h3>
          <p>{project.description}</p>
        </>
      ) : (
        <p>Loading project details...</p>
      )}

      <h3>Tasks</h3>
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p>No tasks assigned to you for this project.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <strong>{task.title}</strong> – {task.description}
              <br />
              Status:
              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task.id, e.target.value)}
                className="task-select"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProjectDetail;
