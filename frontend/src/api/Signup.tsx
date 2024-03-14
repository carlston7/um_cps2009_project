import axiosInstance from './AxiosInstance';
import SignupRequest from '../models/SignupRequest';
import axios from 'axios';

export const apiSignup = async (data: SignupRequest) => {
    try {
        const response = await axiosInstance.post(`/signup`, data);

        const { email_address, type } = response.data;
        localStorage.setItem('userEmail', email_address);
        localStorage.setItem('userType', type);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) { 
            console.error('Signup error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};
