import axios from 'axios';
import { Court, CourtCreateRequest, CourtUpdateRequest, TimeSlot } from '../models/Courts';
import axiosInstance from './AxiosInstance';



export const createCourt = async (data: CourtCreateRequest) => {
    return axiosInstance.post(`/court`, data);
};

export const updateCourt = async (courtId: string, data: CourtUpdateRequest) => {
    return axiosInstance.patch(`$/court/${courtId}`, data);
};

export const getCourts = async (): Promise<Court[]> => {
    const response = await axiosInstance.get(`/courts`);
    return response.data;
};

export const getCourtAvailability = async (courtId: string, date: string): Promise<TimeSlot[]> => {
    const response = await axiosInstance.get(`/court-availability`, { params: { courtId, date } });
    return response.data;
};
