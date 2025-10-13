// frontend/src/components/providerDashboard/CustomerBookings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CustomerBookings.css';

const CustomerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/bookings/my-bookings');
                setBookings(response.data);
                setError('');
            } catch (err) {
                setError('Could not fetch bookings.');
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, []);

    if (loading) return <div>Loading bookings...</div>;
    if (error) return <div className="error-message">{error}</div>;

    // A helper function to format the date nicely
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div className="customer-bookings-container">
            <h3>Your Customer Bookings</h3>
            {bookings.length === 0 ? (
                <p>You have no upcoming bookings.</p>
            ) : (
                <table className="bookings-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Customer</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td>{booking.service_title}</td>
                                <td>{booking.customer_email}</td>
                                <td>{formatDate(booking.booking_date)}</td>
                                <td>{booking.booking_time}</td>
                                <td><span className="status-confirmed">{booking.status}</span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default CustomerBookings;