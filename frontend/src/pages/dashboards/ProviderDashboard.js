// frontend/src/pages/dashboards/ProviderDashboard.js
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import StatCard from '../../components/providerDashboard/StatCard';
import MyListings from '../../components/providerDashboard/MyListings';
import AddServiceForm from '../../components/providerDashboard/AddServiceForm';
import CustomerBookings from '../../components/providerDashboard/CustomerBookings'; // 1. Import the new component
import '../../styles/Dashboard.css';

const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState('myServices');
    const [myListingsKey, setMyListingsKey] = useState(0);

    const handleListingCreated = () => {
        setActiveTab('myServices');
        setMyListingsKey(prevKey => prevKey + 1); 
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            <main className="dashboard-content">
                <h2>ProManage Dashboard</h2>
                
                <div className="stats-container">
                    <StatCard title="Total Services" value="0" icon="📦" />
                    <StatCard title="Pending Bookings" value="0" icon="⏳" />
                    <StatCard title="Completed Earnings" value="₹0" icon="💰" />
                </div>

                <div className="dashboard-tabs">
                    <button 
                        className={activeTab === 'myServices' ? 'active' : ''}
                        onClick={() => setActiveTab('myServices')}
                    >
                        My Services
                    </button>
                    <button 
                        className={activeTab === 'addService' ? 'active' : ''}
                        onClick={() => setActiveTab('addService')}
                    >
                        Add Service
                    </button>
                    {/* 2. Add the new Customer Bookings tab */}
                    <button 
                        className={activeTab === 'customerBookings' ? 'active' : ''}
                        onClick={() => setActiveTab('customerBookings')}
                    >
                        Customer Bookings
                    </button>
                </div>

                <div className="dashboard-tab-content">
                    {activeTab === 'myServices' && <MyListings key={myListingsKey} />}
                    {activeTab === 'addService' && <AddServiceForm onListingCreated={handleListingCreated} />}
                    {/* 3. Render the new component when the tab is active */}
                    {activeTab === 'customerBookings' && <CustomerBookings />}
                </div>
            </main>
        </div>
    );
};

export default ProviderDashboard;