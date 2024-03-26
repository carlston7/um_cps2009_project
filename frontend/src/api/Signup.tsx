import axiosInstance from './AxiosInstance';
import SignupRequest from '../models/SignupRequest';
import axios from 'axios';

export const apiSignup = async (data: SignupRequest) => {
    try {
        const response = await axiosInstance.post(`/signup`, data);

        const { email, type, password, name, surname, credit } = response.data;
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userType', type);
        localStorage.setItem('userPassword', password);
        localStorage.setItem('userName', name);
        localStorage.setItem('userCredit', credit);
        localStorage.setItem('userSurname', surname);
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
