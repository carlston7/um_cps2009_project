import axiosInstance from './AxiosInstance';
import LoginRequest from '../models/LoginRequest';
import axios from 'axios';
export const apiLogin = async (data: LoginRequest) => {
    try {
        const response = await axiosInstance.post(`/login`, data);
        const { email, type, password } = response.data;
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userType', type);
        localStorage.setItem('userPassword', password);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) { 
            console.error('Login error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};
