import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api'; // Axios instance

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // Default role: user
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const response = await API.post('/users/', {
        username,
        password,
        email,
        role,
      });

      console.log('Registered user:', response.data);
      setSuccessMsg('Registration successful! You can now log in.');
    } catch (error) {
      console.error('Registration error:', error.response);
      setErrorMsg(error.response?.data?.detail || 'Registration failed.');
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Sign Up</h2>
      {errorMsg && <p className="register-error">{errorMsg}</p>}
      {successMsg && <p className="register-success">{successMsg}</p>}

      <form className="register-form" onSubmit={handleRegister}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            className="register-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            className="register-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            className="register-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role:</label>
          <select
            id="role"
            className="register-input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button type="submit" className="register-button">Sign Up</button>
      </form>

      <p className="register-login-link">
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
}

export default Register;
