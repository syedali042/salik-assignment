import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  // Check if user is logged in (by checking access token)
  const isLoggedIn = !!localStorage.getItem("accessToken");
  const userRole = localStorage.getItem("role"); // Get user role

  const handleLogout = () => {
    // Remove tokens from localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/login");
  };

  // Hide Navbar if user is not logged in
  if (!isLoggedIn) return null;

  return (
    <nav className="navbar">
      <Link to="/">Home</Link>
      {" | "}

      {/* Admin-only routes */}
      {userRole === "admin" && (
        <>
          <Link to="/projects">Create Project</Link>
          {" | "}
          <Link to="/tasks">Create Tasks</Link>
          {" | "}
          <Link to="/assign-project">Assign Project</Link>
          {" | "}
        </>
      )}

      {/* Show Logout button if logged in */}
      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;
