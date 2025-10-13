// frontend/src/components/adminDashboard/AnalyticsCard.js
import React from 'react';
import './AnalyticsCard.css';

const AnalyticsCard = ({ title, value, icon }) => {
    return (
        <div className="analytics-card">
            <div className="card-icon">{icon}</div>
            <div className="card-details">
                <span className="card-value">{value}</span>
                <span className="card-title">{title}</span>
            </div>
        </div>
    );
};
export default AnalyticsCard;