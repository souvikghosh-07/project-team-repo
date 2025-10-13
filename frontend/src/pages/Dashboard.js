// frontend/src/pages/Dashboard.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import CustomerDashboard from './dashboards/CustomerDashboard';
import ProviderDashboard from './dashboards/ProviderDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    // If we're still loading the user's data, show a loading message
    if (!user) {
        return <div>Loading...</div>;
    }

    // Check the user's role and render the correct dashboard
    switch (user.role) {
        case 'Customer':
            return <CustomerDashboard />;
        case 'Service Provider':
            return <ProviderDashboard />;
        case 'Admin':
            return <AdminDashboard />;
        default:
            // If the role is unknown, redirect to login or show an error
            // For now, we'll just return null.
            return null;
    }
};

export default Dashboard;