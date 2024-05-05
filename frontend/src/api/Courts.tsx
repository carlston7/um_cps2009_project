import { Court, CourtCreateRequest, CourtUpdateRequest, DateTimeSelection } from '../models/Courts';
import axiosInstance from './AxiosInstance';

/**
 * Creates a new court.
 * @param data - The court data to be created.
 * @returns A promise that resolves to the created court.
 * @throws Error if user type, user email, or user password is not found.
 */
export const createCourt = async (data: CourtCreateRequest) => {
    const userType = localStorage.getItem('userType');
    if (!userType) {
        console.error('No user type found');
        throw new Error('Unauthorized: You must be logged in to make this request');
    }

    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    if (!userPassword || !userEmail) {
        console.error('User email and password not found.');
        throw new Error('User email and password are required for this operation.');
    }
    console.log("User-Email: ", userEmail, "User-Type: ", userType, "User-Password: ", userPassword);
    return axiosInstance.post(`/court`, data, {
        headers: {
            'User-Email': userEmail,
            'User-Type': userType,
            'User-Password': userPassword
        }
    });
};

/**
 * Updates an existing court.
 * @param data - The court data to be updated.
 * @returns A promise that resolves to the updated court.
 * @throws Error if user type, user email, or user password is not found.
 */
export const updateCourt = async (data: CourtUpdateRequest) => {
    const userType = localStorage.getItem('userType');
    if (!userType) {
        console.error('No user type found');
        throw new Error('Unauthorized: You must be logged in to make this request');
    }

    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    if (!userPassword || !userEmail) {
        console.error('User email and password not found.');
        throw new Error('User email and password are required for this operation.');
    }

    return axiosInstance.patch(`/court`, data, {
        headers: {
            'User-Email': userEmail,
            'User-Type': userType,
            'User-Password': userPassword
        }
    });
};

/**
 * Fetches courts based on the specified date and time selection.
 * @param dateTime - The date and time selection.
 * @returns A promise that resolves to an array of courts.
 * @throws Error if there is an error fetching the courts.
 */
export const fetchCourts = async (dateTime: DateTimeSelection): Promise<Court[]> => {
    try {
        console.log("dateTime: ", dateTime);
        const response = await axiosInstance.get<Court[]>('/courts', {
            params: {
                dateTime: dateTime.dateTime,
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching courts:', error);
        throw error;
    }
};

/**
 * Fetches all courts.
 * @returns A promise that resolves to an array of all courts.
 * @throws Error if there is an error getting all courts.
 */
export const fetchAllCourts = async (): Promise<Court[]> => {
    try {
        const response = await axiosInstance.get<Court[]>('/courts-all');
        console.log("received courts: ", response);
        return response.data;
    } catch (error) {
        console.error('Error getting all courts:', error);
        throw error;
    }
};