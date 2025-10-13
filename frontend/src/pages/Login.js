// frontend/src/pages/Login.js

import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import our context
import './../styles/AuthForm.css'; // Dedicated CSS for auth pages

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login } = useContext(AuthContext); // Get the login function from context

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const response = await axios.post('/api/login', formData);
            if (response.status === 200) {
                 // 1. Use the context to set the user state globally
                 login(response.data.user);
                 // 2. Navigate to the dashboard page
                 navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <div className="logo">QuickServe</div>
                <h2>Welcome Back!</h2>
                <p>Sign in to continue to your account.</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            className="form-input"
                            required
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="form-input"
                            required
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <button type="submit" className="auth-submit-btn">Sign In</button>
                </form>
                <p className="auth-redirect-link">
                    Don't have an account? <Link to="/signup">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;