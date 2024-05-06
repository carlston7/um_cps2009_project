import axiosInstance from './AxiosInstance';
import SignupRequest from '../models/SignupRequest';
import axios from 'axios';

/**
 * Sends a PATCH request to edit the user profile.
 * 
 * @param data - The data to be sent in the request body.
 * @returns A Promise that resolves to the response from the server.
 * @throws If an error occurs during the request.
 */
export const apiEditProfile = async (data: SignupRequest) => {
    try {
        const response = await axiosInstance.patch(`/profile`, data);
        console.log("response", response.data);
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
