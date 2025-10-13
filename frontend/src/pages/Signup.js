// frontend/src/pages/Signup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AuthForm.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '', // Add name to state
        email: '',
        password: '',
        confirmPassword: '',
        role: null,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.role) {
            return setError('Please select a role.');
        }
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match.');
        }

        try {
            // Send the 'name' field along with the other data
            const response = await axios.post('/api/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            });
            if (response.status === 201) {
                setSuccess('Registration successful! Redirecting to login...');
                setTimeout(() => navigate('/login'), 2000);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-card">
                <div className="logo">QuickServe</div>
                <h2>Create Your Account</h2>
                <p>Get started by creating a new account.</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    {/* Role selector remains the same */}
                    <div className="form-group">
                        <label>Choose your role:</label>
                        <div className="role-selector">
                            <button type="button" className={`role-button ${formData.role === 'Customer' ? 'selected' : ''}`} onClick={() => handleRoleChange('Customer')}>
                                I am a Customer
                            </button>
                            <button type="button" className={`role-button ${formData.role === 'Service Provider' ? 'selected' : ''}`} onClick={() => handleRoleChange('Service Provider')}>
                                I am a Provider
                            </button>
                        </div>
                    </div>
                    {/* New "Full Name" input field */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input type="text" name="name" id="name" className="form-input" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" className="form-input" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" id="password" className="form-input" required onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input type="password" name="confirmPassword" id="confirmPassword" className="form-input" required onChange={handleChange} />
                    </div>
                    <button type="submit" className="auth-submit-btn">Sign Up</button>
                </form>

                <p className="auth-redirect-link">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;