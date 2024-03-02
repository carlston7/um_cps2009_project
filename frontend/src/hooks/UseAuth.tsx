import { useState } from 'react';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // To do: implement login, logout, token handling here
    return { isAuthenticated };
};