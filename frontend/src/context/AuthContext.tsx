import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axiosInstance from '../api/axiosInstance';
import { IUser } from '../../../backend/src/modules/users/user.model'; // We could redefine it here or use a shared frontend type. Let's define a clean frontend type.

export interface FrontendUser {
    _id: string;
    name: string;
    email: string;
    role: 'patient' | 'doctor' | 'admin' | 'receptionist' | 'nurse';
    profileImage?: string;
    isActive: boolean;
}

interface AuthContextType {
    user: FrontendUser | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<any>;
    register: (userData: any) => Promise<any>;
    logout: () => Promise<void>;
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
            try {
                const res = await axiosInstance.get('/api/auth/profile');
                if (res.data.success) {
                    setUser(res.data.data);
                }
            } catch (error: any) {
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
            setUser(res.data.data);
        }
        return res.data;
    };

    const register = async (userData: any): Promise<any> => {
        const res = await axiosInstance.post('/api/auth/register', userData);
        if (res.data.success) {
            setUser(res.data.data);
        }
        return res.data;
    };

    const logout = async (): Promise<void> => {
        await axiosInstance.post('/api/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
