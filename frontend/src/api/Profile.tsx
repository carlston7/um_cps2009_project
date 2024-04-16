import axiosInstance from './AxiosInstance';
import SignupRequest from '../models/SignupRequest';
import axios from 'axios';

export const apiEditProfile = async (data: SignupRequest) => {
    try {
        const response = await axiosInstance.patch(`/profile`, data);

        const { name, surname } = response.data;
        localStorage.setItem('userName', name);
        localStorage.setItem('userSurname', surname);
        return response;
    } catch (error: unknown) {
        if (axios.isAxiosError(error)) { 
            console.error('Error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};
