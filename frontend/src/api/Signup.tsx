import axiosInstance from './AxiosInstance';
import SignupRequest from '../models/SignupRequest';

export const apiSignup = async (data: SignupRequest) => {
    return axiosInstance.post(`/signup`, data);
};

