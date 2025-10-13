// frontend/src/components/customerDashboard/BookingModal.js
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import '../../styles/Calendar.css'; // Import calendar styles
import './BookingModal.css';

// Predefined available time slots
const timeSlots = ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00'];

const BookingModal = ({ listing, onClose, onBookingSuccess }) => {
    const [date, setDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleConfirmBooking = async () => {
        if (!selectedTime) {
            setError('Please select a time slot.');
            return;
        }
        setError('');
        setSuccess('');

        try {
            const bookingData = {
                listing_id: listing.id,
                // Format date to YYYY-MM-DD
                booking_date: date.toISOString().split('T')[0],
                booking_time: selectedTime,
            };
            const response = await axios.post('/api/bookings', bookingData);
            setSuccess(response.data.message);
            // Optionally, close the modal after a short delay
            setTimeout(() => {
                onBookingSuccess();
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed. Please try again.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h2>Book Appointment for <br/>"{listing.title}"</h2>
                
                {error && <p className="modal-message error">{error}</p>}
                {success && <p className="modal-message success">{success}</p>}

                {!success && (
                    <>
                        <div className="booking-steps">
                            <div className="step">
                                <h4>1. Select a Date</h4>
                                <Calendar 
                                    onChange={setDate} 
                                    value={date} 
                                    minDate={new Date()} // Prevent booking past dates
                                />
                            </div>
                            <div className="step">
                                <h4>2. Select a Time</h4>
                                <div className="time-slots-container">
                                    {timeSlots.map(time => (
                                        <button 
                                            key={time}
                                            className={`time-slot-btn ${selectedTime === time ? 'selected' : ''}`}
                                            onClick={() => setSelectedTime(time)}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={handleConfirmBooking} 
                            className="confirm-booking-btn"
                            disabled={!selectedTime}
                        >
                            Confirm Booking
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default BookingModal;