// frontend/src/components/customerDashboard/ReviewModal.js
import React, { useState } from 'react';
import axios from 'axios';
import './ReviewModal.css';

const ReviewModal = ({ booking, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async () => {
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        setError('');
        setSuccess('');

        try {
            const reviewData = {
                booking_id: booking.id,
                rating,
                comment
            };
            const response = await axios.post('/api/reviews', reviewData);
            setSuccess(response.data.message);
            setTimeout(() => {
                onReviewSubmitted();
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review.');
        }
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content review-modal">
                <button onClick={onClose} className="modal-close-btn">&times;</button>
                <h2>Rate Your Experience</h2>
                <p>How was your experience with <strong>{booking.service_title}</strong>?</p>
                
                {error && <p className="modal-message error">{error}</p>}
                {success && <p className="modal-message success">{success}</p>}

                {!success && (
                    <>
                        <div className="star-rating">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span 
                                    key={star}
                                    className={star <= rating ? 'star filled' : 'star'}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                        <textarea
                            className="review-comment"
                            placeholder="Leave a comment (optional)"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <button onClick={handleSubmit} className="submit-review-btn">
                            Submit Review
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReviewModal;