import axiosInstance from './AxiosInstance';
import LoginRequest from '../models/LoginRequest';
import axios from 'axios';

/**
 * Makes an API call to login the user.
 * @param data - The login request data.
 * @returns A promise that resolves to the API response.
 * @throws If an error occurs during the API call.
 */
export const apiLogin = async (data: LoginRequest) => {
    try {
        const response = await axiosInstance.post(`/login`, data);
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
            console.error('Login error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};

/**
 * Makes an API call to send a one-time code to the user's email.
 * @param data - The data required to send the one-time code.
 * @returns A promise that resolves to the API response.
 * @throws If an error occurs during the API call.
 */
export const apiEmailOneTimeCode = async (data: any) => {
    try {
        const response = await axiosInstance.post('/email-one-time-code', data);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Email one-time code error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
}

/**
 * Makes an API call to reset the user's password.
 * @param data - The data required to reset the password.
 * @returns A promise that resolves to the API response.
 * @throws If an error occurs during the API call.
 */
export const apiForgetPassword = async (data: any) => {
    try {
        const email_address = localStorage.getItem('userEmail');
        const response = await axiosInstance.post('/forget-password', { ...data, email_address });
        const { email, password} = response.data;
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userPassword', password);
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Forget password error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error;
    }
};
