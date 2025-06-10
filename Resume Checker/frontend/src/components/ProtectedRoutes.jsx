import React from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Optionally, you can add token refresh logic here
    const refreshAccessToken = async () => {
        try {
            const response = await axios.post(
                `${config.API_BASE_URL}${config.API_ENDPOINTS.REFRESH_TOKEN}`,
                { refresh: refreshToken }
            );
            if (response.data.access) {
                localStorage.setItem('access_token', response.data.access);
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            }
        } catch (error) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
        }
    };

    // You can call refreshAccessToken() here if you want to auto-refresh

    return children;
};

export default ProtectedRoute;