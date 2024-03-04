import axiosInstance from './AxiosInstance';
import LoginRequest from '../models/LoginRequest';

export const apiLogin = async (data: LoginRequest) => {
    return axiosInstance.post(`/login`, data);
};
