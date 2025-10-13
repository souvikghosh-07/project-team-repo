// frontend/src/components/adminDashboard/ListingApprovals.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ListingApprovals.css';

const ListingApprovals = () => {
    const [pendingListings, setPendingListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingListings = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/admin/pending-listings');
            setPendingListings(response.data);
        } catch (error) {
            console.error("Failed to fetch pending listings", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingListings();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            await axios.patch(`/api/admin/listings/${id}`, { status });
            // Refresh the list by filtering out the one we just handled
            setPendingListings(prev => prev.filter(listing => listing.id !== id));
        } catch (error) {
            alert(`Failed to ${status.toLowerCase()} the listing.`);
            console.error("Failed to update status", error);
        }
    };

    if (loading) return <p>Loading listings for approval...</p>;

    return (
        <div className="listing-approvals-container">
            <h4>Pending Service Approvals</h4>
            {pendingListings.length === 0 ? (
                <p>No new services are waiting for approval.</p>
            ) : (
                <div className="approval-list">
                    {pendingListings.map(listing => (
                        <div key={listing.id} className="approval-item">
                            <div className="item-details">
                                <span className="item-title">{listing.title}</span>
                                <span className="item-category">{listing.category} - {listing.location}</span>
                            </div>
                            <div className="item-actions">
                                <button onClick={() => handleUpdateStatus(listing.id, 'Approved')} className="action-btn approve">Approve</button>
                                <button onClick={() => handleUpdateStatus(listing.id, 'Rejected')} className="action-btn reject">Reject</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
export default ListingApprovals;