// frontend/src/components/providerDashboard/MyListings.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyListings.css';

const MyListings = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchListings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/listings/my-listings');
            setListings(response.data);
            setError('');
        } catch (err) {
            setError('Could not fetch listings. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchListings();
    }, []);

    const handleDelete = async (listingId) => {
        if (window.confirm('Are you sure you want to delete this listing?')) {
            try {
                await axios.delete(`/api/listings/${listingId}`);
                // Refresh the list after deleting
                fetchListings(); 
            } catch (err) {
                alert('Failed to delete listing.');
                console.error(err);
            }
        }
    };

    if (loading) return <div>Loading your listings...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="my-listings-container">
            <h3>Your Service Listings</h3>
            {listings.length === 0 ? (
                <p>You haven't created any listings yet.</p>
            ) : (
                <table className="listings-table">
                    <thead>
                        <tr>
                            <th>Service</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {listings.map((listing) => (
                            <tr key={listing.id}>
                                <td>{listing.title}</td>
                                <td>{listing.category}</td>
                                <td>₹{Number(listing.price).toLocaleString()}</td>
                                <td><span className="status-approved">Approved</span></td>
                                <td>
                                    <button onClick={() => handleDelete(listing.id)} className="action-btn delete-btn">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyListings;