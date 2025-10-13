// frontend/src/components/customerDashboard/ServiceCard.js
import React from 'react';
import StarRating from '../../components/shared/StarRating'; // Import the new component
import './ServiceCard.css';

const placeholderImage = 'https://placehold.co/600x400/2a2a2a/f0f0f0?text=Service';

const ServiceCard = ({ listing, onBook }) => {
    const imageUrl = listing.image_path 
        ? `http://localhost:3001${listing.image_path}` 
        : placeholderImage;

    const rating = parseFloat(listing.average_rating) || 0;

    return (
        <div className="service-card">
            <div className="card-image-container">
                <img 
                    src={imageUrl} 
                    alt={listing.title} 
                    className="card-image"
                    onError={(e) => { e.target.onerror = null; e.target.src=placeholderImage; }}
                />
                <span className="card-status-available">Available</span>
            </div>
            <div className="card-content">
                <p className="card-category">{listing.category}</p>
                <h3 className="card-title">{listing.title}</h3>
                <div className="card-review-summary">
                    {listing.review_count > 0 ? (
                        <>
                            <StarRating rating={rating} />
                            <span className="review-count">({listing.review_count} reviews)</span>
                        </>
                    ) : (
                        <span className="review-count">No reviews yet</span>
                    )}
                </div>
                <div className="card-footer">
                    <span className="card-price">₹{Number(listing.price).toLocaleString()}</span>
                    <button onClick={() => onBook(listing)} className="card-book-btn">Book Now</button>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;