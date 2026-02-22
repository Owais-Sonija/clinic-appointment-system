import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';

export interface FrontendUser {
    _id: string;
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin' | 'receptionist' | 'nurse';
    profileImage?: string;
    isActive: boolean;
    hasCompletedTour?: boolean;
}

interface AuthContextType {
    user: FrontendUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (userData: any) => Promise<any>;
    logout: () => Promise<void>;
    setUser: React.Dispatch<React.SetStateAction<FrontendUser | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<FrontendUser | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuth = async () => {
            // Only attempt to restore session if user previously logged in
            const hasSession = localStorage.getItem('clinic_session');
            if (!hasSession) {
                setUser(null);
                setLoading(false);
                return;
            }

            try {
                const baseURL = axiosInstance.defaults.baseURL || 'http://localhost:5000';
                const res = await axios.get(`${baseURL}/api/auth/profile`, { withCredentials: true });
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch {
                // Session expired or invalid — clear the flag
                localStorage.removeItem('clinic_session');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email: string, password: string): Promise<any> => {
        const res = await axiosInstance.post('/api/auth/login', { email, password });
        if (res.data.success) {
            localStorage.setItem('clinic_session', 'true');
            setUser(res.data.data);
        }
        return res.data;
    };

    const register = async (userData: any): Promise<any> => {
        const res = await axiosInstance.post('/api/auth/register', userData);
        if (res.data.success) {
            localStorage.setItem('clinic_session', 'true');
            setUser(res.data.data);
        }
        return res.data;
    };

    const logout = async (): Promise<void> => {
        await axiosInstance.post('/api/auth/logout');
        localStorage.removeItem('clinic_session');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout, setUser }}>
            {children}
        </AuthContext.Provider>
    );
};
