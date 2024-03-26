import { Court, CourtCreateRequest, CourtUpdateRequest, DateTimeSelection } from '../models/Courts';
import axiosInstance from './AxiosInstance';

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

export const bookCourt = {

};