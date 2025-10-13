// frontend/src/pages/dashboards/AdminDashboard.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../../components/Navbar';
import AnalyticsCard from '../../components/adminDashboard/AnalyticsCard';
import AnalyticsList from '../../components/adminDashboard/AnalyticsList';
import ListingApprovals from '../../components/adminDashboard/ListingApprovals';
import '../../styles/Dashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('analytics');
    const [stats, setStats] = useState({});
    const [topCategories, setTopCategories] = useState([]);
    const [topServices, setTopServices] = useState([]);
    const [loading, setLoading] = useState(true);

    // This useEffect fetches all the data needed for the Analytics tab
    useEffect(() => {
        const fetchAdminData = async () => {
            try {
                setLoading(true);
                const [statsRes, categoriesRes, servicesRes] = await Promise.all([
                    axios.get('/api/admin/stats'),
                    axios.get('/api/admin/top-categories'),
                    axios.get('/api/admin/top-services')
                ]);
                setStats(statsRes.data);
                setTopCategories(categoriesRes.data);
                setTopServices(servicesRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };

        // We only fetch this data if the analytics tab is active
        if (activeTab === 'analytics') {
            fetchAdminData();
        }
    }, [activeTab]); // The key change is re-running this when the tab changes

    return (
        <div className="dashboard-container">
            <Navbar />
            
            <div className="dashboard-tabs admin-tabs">
                <button 
                    className={activeTab === 'analytics' ? 'active' : ''}
                    onClick={() => setActiveTab('analytics')}
                >
                    Analytics
                </button>
                <button 
                    className={activeTab === 'approvals' ? 'active' : ''}
                    onClick={() => setActiveTab('approvals')}
                >
                    Listing Approvals
                </button>
            </div>

            <main className="dashboard-content no-top-padding">
                {activeTab === 'analytics' && (
                    <>
                        {loading ? <p>Loading analytics...</p> : (
                            <>
                                <div className="stats-container">
                                    <AnalyticsCard title="Total Users" value={stats.totalUsers ?? 0} icon="👥" />
                                    <AnalyticsCard title="Service Providers" value={stats.totalProviders ?? 0} icon="🛠️" />
                                    <AnalyticsCard title="Total Services" value={stats.totalListings ?? 0} icon="📦" />
                                    <AnalyticsCard title="Total Bookings" value={stats.totalBookings ?? 0} icon="✅" />
                                </div>
                                <div className="analytics-lists-container">
                                    <AnalyticsList 
                                        title="Top Categories" 
                                        items={topCategories}
                                        dataKey="category"
                                        countKey="booking_count"
                                    />
                                    <AnalyticsList 
                                        title="Top Services" 
                                        items={topServices}
                                        dataKey="title"
                                        countKey="booking_count"
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}

                {activeTab === 'approvals' && <ListingApprovals />}
            </main>
        </div>
    );
};

export default AdminDashboard;