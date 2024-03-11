import axiosInstance from './AxiosInstance';

export const apiCreatePaymentIntent = async (token: string) => {
    const userType = localStorage.getItem('userType');
    if (!userType) {
        console.error('No user type found');
        throw new Error('Unauthorized: You must be logged in to make this request');
    }

    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
        console.error('User email not found.');
        throw new Error('User email is required for this operation.');
    }

    console.log('Sending payment id:', token);
    return axiosInstance.post(`/payment`, { token, email: userEmail });
};
