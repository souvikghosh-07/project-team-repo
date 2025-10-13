// frontend/src/components/providerDashboard/StatCard.js
import React from 'react';
import './StatCard.css';

const StatCard = ({ title, value, icon }) => {
    return (
        <div className="stat-card">
            <div className="stat-icon">{icon}</div>
            <div className="stat-info">
                <span className="stat-title">{title}</span>
                <span className="stat-value">{value}</span>
            </div>
        </div>
    );
};

export default StatCard;