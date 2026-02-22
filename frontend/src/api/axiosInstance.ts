/// <reference types="vite/client" />
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Response interceptor for handling token refresh
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token via the silent refresh endpoint (Http-Only cookie based)
                const res = await axiosInstance.post('/api/auth/refresh');

                if (res.status === 200) {
                    // Retry the original request
                    return axiosInstance(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - redirect to login or clear state
                // We'll let the application handle the final failure
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
