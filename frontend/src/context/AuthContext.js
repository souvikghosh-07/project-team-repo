// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// CRITICAL: We create and EXPORT the context. This is a NAMED export.
export const AuthContext = createContext(null);

// CRITICAL: We create and EXPORT the provider. This is also a NAMED export.
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const response = await axios.get('/api/current-user');
            setUser(response.data.user);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const login = (userData) => {
        setUser(userData);
    };

    const logout = async () => {
        try {
            await axios.post('/api/logout');
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
        }
    };

    const contextValue = {
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};