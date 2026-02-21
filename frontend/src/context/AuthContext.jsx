import React, { createContext, useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await axiosInstance.get('/api/auth/profile');
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
        const res = await axiosInstance.post('/api/auth/login', { email, password });
        if (res.data.success) {
            setUser(res.data.data);
        }
        return res.data;
    };

    const register = async (userData) => {
        const res = await axiosInstance.post('/api/auth/register', userData);
        if (res.data.success) {
            setUser(res.data.data);
        }
        return res.data;
    };

    const logout = async () => {
        await axiosInstance.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
