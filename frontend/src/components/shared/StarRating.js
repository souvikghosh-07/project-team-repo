// frontend/src/components/shared/StarRating.js
import React from 'react';
import './StarRating.css';

const StarRating = ({ rating }) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    return (
        <div className="star-rating-display">
            {[...Array(fullStars)].map((_, i) => <span key={`full-${i}`} className="star filled">★</span>)}
            {halfStar && <span className="star filled">★</span>} {/* Simple half-star representation for now */}
            {[...Array(emptyStars)].map((_, i) => <span key={`empty-${i}`} className="star">★</span>)}
        </div>
    );
};
export default StarRating;