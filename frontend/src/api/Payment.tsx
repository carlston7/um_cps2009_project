import axiosInstance from './AxiosInstance';

export const apiCreatePaymentIntent = async (paymentMethodId: string) => {
    console.log('Sending payment id:', paymentMethodId);
    return axiosInstance.post(`/payment`, { paymentMethodId });
};
