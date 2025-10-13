// frontend/src/components/customerDashboard/FilterBar.js
import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ onFilterChange }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [location, setLocation] = useState('');
    const [category, setCategory] = useState('');

    // This function is called whenever any filter value changes
    const handleFilter = () => {
        onFilterChange({
            searchTerm, // We'll handle search on the frontend for simplicity for now
            location,
            category,
        });
    };
    
    // We can trigger the filter on button click
    const handleSearchClick = () => {
        handleFilter();
    };

    // Or trigger it automatically when the category dropdown changes
    const handleCategoryChange = (e) => {
        setCategory(e.target.value);
        // We call the parent function immediately after a dropdown change
        onFilterChange({ searchTerm, location, category: e.target.value });
    };

    return (
        <div className="filter-bar-container">
            <div className="filter-input-group">
                <input
                    type="text"
                    placeholder="Search by service (e.g., plumbing)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="filter-input search-input"
                />
                <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="filter-input location-input"
                />
                <select 
                    value={category} 
                    onChange={handleCategoryChange} 
                    className="filter-input category-select"
                >
                    <option value="">All Categories</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Tutoring">Tutoring</option>
                    <option value="Gardening">Gardening</option>
                    <option value="IT Services">IT Services</option>
                </select>
                <button onClick={handleSearchClick} className="search-button">Search</button>
            </div>
        </div>
    );
};

export default FilterBar;