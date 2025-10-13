// frontend/src/components/customerDashboard/MyBookings.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReviewModal from './ReviewModal';
import './MyBookings.css';

const MyBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const fetchMyBookings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/bookings/my-customer-bookings');
            setBookings(response.data);
        } catch (err) {
            setError('Could not fetch your bookings.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyBookings();
    }, []);
    
    const handleOpenReviewModal = (booking) => {
        setSelectedBooking(booking);
        setIsReviewModalOpen(true);
    };

    const handleCloseReviewModal = () => {
        setSelectedBooking(null);
        setIsReviewModalOpen(false);
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // THE FIX IS ON THIS LINE: Corrected to toLocaleDateString()
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) return <p>Loading your bookings...</p>;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <>
            <div className="my-bookings-container">
                <h3>Your Booking History</h3>
                {bookings.length === 0 ? (
                    <p>You have not booked any services yet. Start exploring!</p>
                ) : (
                    <div className="bookings-list">
                        {bookings.map(booking => (
                            <div key={booking.id} className="booking-item">
                                <div className="booking-details">
                                    <h4 className="booking-service-title">{booking.service_title}</h4>
                                    <p className="booking-info">
                                        <strong>Date:</strong> {formatDate(booking.booking_date)} at {booking.booking_time}
                                    </p>
                                    <p className="booking-info">
                                        <strong>Location:</strong> {booking.location}
                                    </p>
                                </div>
                                <div className="booking-status-section">
                                    <span className="booking-status">{booking.status}</span>
                                    <button 
                                        onClick={() => handleOpenReviewModal(booking)}
                                        className="review-btn"
                                    >
                                        Leave a Review
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {isReviewModalOpen && (
                <ReviewModal
                    booking={selectedBooking}
                    onClose={handleCloseReviewModal}
                    onReviewSubmitted={fetchMyBookings}
                />
            )}
        </>
    );
};

export default MyBookings;