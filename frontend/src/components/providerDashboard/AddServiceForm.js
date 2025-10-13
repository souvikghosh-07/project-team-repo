// frontend/src/components/providerDashboard/AddServiceForm.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddServiceForm.css';

const AddServiceForm = ({ onListingCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        location: '',
        category: '',
    });
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Use FormData because we are sending a file
        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('price', formData.price);
        submissionData.append('location', formData.location);
        submissionData.append('category', formData.category);
        if (file) {
            submissionData.append('image', file);
        }

        try {
            const response = await axios.post('/api/listings', submissionData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess(response.data.message);
            // Clear the form
            setFormData({ title: '', description: '', price: '', location: '', category: '' });
            setFile(null);
            // Notify the parent component to switch tabs or refresh list
            if (onListingCreated) {
                onListingCreated();
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create listing.');
        }
    };

    return (
        <div className="add-service-container">
            <h3>Create a New Service Listing</h3>
            {error && <div className="form-message error">{error}</div>}
            {success && <div className="form-message success">{success}</div>}
            <form onSubmit={handleSubmit} className="service-form">
                <div className="form-group">
                    <label htmlFor="title">Service Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="category">Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleChange} required placeholder="e.g., Plumbing, Tutoring, Electrical"/>
                </div>
                 <div className="form-group">
                    <label htmlFor="location">Location</label>
                    <input type="text" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g., Nagpur, MH" />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleChange} required />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange}></textarea>
                </div>
                <div className="form-group">
                    <label htmlFor="image">Service Image (Optional)</label>
                    <input type="file" name="image" onChange={handleFileChange} />
                </div>
                <button type="submit" className="submit-listing-btn">Create Listing</button>
            </form>
        </div>
    );
};

export default AddServiceForm;