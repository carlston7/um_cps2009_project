import axios from 'axios';
import SignupRequest from '../models/SignupRequest';

const API_BASE_URL = 'https://api.sportsclubbooking.com/v1';

export const signup = async (data: SignupRequest) => {
    return axios.post(`${API_BASE_URL}/signup`, data);
};

