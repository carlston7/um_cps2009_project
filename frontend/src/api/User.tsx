import axiosInstance from './AxiosInstance';

/**
 * Function to fetch user credit from the backend.
 * @returns The user's credit.
 * @throws Error if the user type or email is not found, or if there is an error fetching the credit.
 */
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

/**
 * Function to respond to an invitation.
 * @param _id - The ID of the invitation.
 * @param email_address - The email address of the invitation.
 * @param accept - Whether to accept or decline the invitation.
 * @returns The response data.
 */
export const respondToInvitation = async ({ _id, email_address, accept }: { _id: string, email_address: string, accept: boolean }) => {
    const response = await axiosInstance.post('/respond', {
        _id,
        email_address,
        accept
    });
    return response.data;
};

/**
 * Function to send credit to a user.
 * @param email - The email address of the user.
 * @param amount - The amount of credit to send.
 * @returns The response data.
 * @throws Error if there is an error sending the credit.
 */
const sendCredit = async (email: any, amount: any) => {
    try {
        const response = await axiosInstance.patch('/send/credit', { email, amount }, {
            headers: { 'user-email': localStorage.getItem('userEmail') }
        });
        localStorage.setItem('userCredit', response.data.senderCredit);
        return response.data;
    } catch (error) {
        console.error('Failed to send credit:', (error as Error).message);
        throw error;
    }
};

export default sendCredit;
