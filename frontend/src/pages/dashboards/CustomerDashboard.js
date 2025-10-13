// frontend/src/pages/dashboards/CustomerDashboard.js
import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import ExploreServices from '../../components/customerDashboard/ExploreServices'; // We will create this next
import MyBookings from '../../components/customerDashboard/MyBookings';
import BookingModal from '../../components/customerDashboard/BookingModal';
import '../../styles/Dashboard.css';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('explore');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedListing, setSelectedListing] = useState(null);

    const handleOpenModal = (listing) => {
        setSelectedListing(listing);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setSelectedListing(null);
        setIsModalOpen(false);
    };

    return (
        <div className="dashboard-container">
            <Navbar />
            
            <div className="dashboard-tabs customer-tabs">
                <button 
                    className={activeTab === 'explore' ? 'active' : ''}
                    onClick={() => setActiveTab('explore')}
                >
                    Explore Services
                </button>
                <button 
                    className={activeTab === 'myBookings' ? 'active' : ''}
                    onClick={() => setActiveTab('myBookings')}
                >
                    My Bookings
                </button>
            </div>

            <main className="dashboard-content no-top-padding">
                {activeTab === 'explore' && <ExploreServices onBook={handleOpenModal} />}
                {activeTab === 'myBookings' && <MyBookings />}
            </main>

            {isModalOpen && (
                <BookingModal 
                    listing={selectedListing} 
                    onClose={handleCloseModal}
                    onBookingSuccess={() => console.log('Booking successful!')}
                />
            )}
        </div>
    );
};

export default CustomerDashboard;