import axios from 'axios';
import LoginRequest from '../models/LoginRequest';

const API_BASE_URL = 'https://api.sportsclubbooking.com/v1';

export const login = async (data: LoginRequest) => {
    return axios.post(`${API_BASE_URL}/login`, data);
};
