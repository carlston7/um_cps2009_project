import axiosInstance from './AxiosInstance';

// Function to fetch user credit from the backend
export const fetchUserCredit = async () => {
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

    try {
        const response = await axiosInstance.get(`/credit`, {
            headers: {
                'User-Email': userEmail,
            }
        });

        if (response.status !== 200) {
            throw new Error(`Failed to fetch credit: ${response.status}`);
        }
        localStorage.setItem('userCredit', response.data.credit);
        return response.data.credit; // Assuming the response will be { credit: number }
    } catch (e) {
        console.error('Error fetching user credit:', e);
        throw e;
    }
}
