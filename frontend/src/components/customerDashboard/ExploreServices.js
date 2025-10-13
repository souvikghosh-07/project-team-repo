// frontend/src/components/customerDashboard/ExploreServices.js

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import ServiceCard from './ServiceCard';
import FilterBar from './FilterBar';

// This component receives the 'onBook' function as a prop from CustomerDashboard
const ExploreServices = ({ onBook }) => {
    const [allListings, setAllListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAllListings = useCallback(async (filters = {}) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (filters.location) params.append('location', filters.location);
            if (filters.category) params.append('category', filters.category);

            const response = await axios.get(`/api/listings?${params.toString()}`);
            
            let data = response.data;
            if (filters.searchTerm) {
                data = data.filter(listing => 
                    listing.title.toLowerCase().includes(filters.searchTerm.toLowerCase())
                );
            }

            setAllListings(data);
            setFilteredListings(data);
            setError('');
        } catch (err) {
            setError('Could not fetch services. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAllListings();
    }, [fetchAllListings]);

    const handleFilterChange = (filters) => {
        fetchAllListings(filters);
    };

    return (
        <>
            <div className="page-header">
                <h2>Explore Services</h2>
                <p>Find the best professionals for your needs, right in your area.</p>
            </div>

            <FilterBar onFilterChange={handleFilterChange} />

            {loading && <p>Loading services...</p>}
            {error && <p className="error-message">{error}</p>}
            
            {!loading && !error && (
                <div className="service-listings-grid">
                    {filteredListings.length > 0 ? (
                        filteredListings.map(listing => (
                            <ServiceCard 
                                key={listing.id} 
                                listing={listing} 
                                // We pass the onBook function down to the card
                                onBook={onBook} 
                            />
                        ))
                    ) : (
                        <p>No services match your criteria. Try broadening your search!</p>
                    )}
                </div>
            )}
        </>
    );
};

export default ExploreServices;