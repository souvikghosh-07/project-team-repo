// frontend/src/components/Navbar.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <nav className="dashboard-nav">
            <div className="nav-logo">
                <Link to="/">QuickServe</Link>
            </div>
            <div className="nav-user-info">
                {/* THE FINAL CHANGE: Display user's name instead of email */}
                <span>Welcome, {user?.name}</span>
                <button onClick={logout} className="logout-button">
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;