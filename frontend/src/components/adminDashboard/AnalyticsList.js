// frontend/src/components/adminDashboard/AnalyticsList.js
import React from 'react';
import './AnalyticsList.css';

const AnalyticsList = ({ title, items, dataKey, countKey }) => {
    return (
        <div className="analytics-list-container">
            <h4>{title}</h4>
            <ul className="analytics-list">
                {items.length > 0 ? items.map((item, index) => (
                    <li key={index} className="list-item">
                        <span>{item[dataKey]}</span>
                        <span>{item[countKey]} Bookings</span>
                    </li>
                )) : <p>No data available yet.</p>}
            </ul>
        </div>
    );
};
export default AnalyticsList;