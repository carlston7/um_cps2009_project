import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isAdmin: boolean,
    login: (token: string) => void;
    logout: () => void;
}

interface AuthProviderProps {
    children: ReactNode;
}
const defaultContextValue: AuthContextType = {
    isAuthenticated: false,
    isAdmin: false,
    login: () => { },
    logout: () => { },
};

export const AuthContext = createContext<AuthContextType>(defaultContextValue);

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false); 

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const userType = localStorage.getItem('userType');
        setIsAuthenticated(!!token);
        setIsAdmin(userType === 'admin');
    }, []);

    const login = (token: string) => {
        localStorage.setItem('authToken', token);
        const userType = localStorage.getItem('userType');
        setIsAuthenticated(true);
        setIsAdmin(userType === 'admin');
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
