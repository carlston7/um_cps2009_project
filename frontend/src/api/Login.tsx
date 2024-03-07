import axiosInstance from './AxiosInstance';
import LoginRequest from '../models/LoginRequest';

export const apiLogin = async (data: LoginRequest) => {
    console.log('login: ', data);
    return axiosInstance.post(`/login`, data);
};
