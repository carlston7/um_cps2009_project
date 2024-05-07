const { get_court_price } = require('../../controllers/courtcontroller');
const { get_user_credit } = require('../../controllers/usercontroller');
const User = require('../../models/users');

jest.mock('../../models/courts', () => ({
    findOne: jest.fn().mockResolvedValue({ nightPrice: 60, dayPrice: 30 })
}));

beforeEach(() => {
    jest.clearAllMocks();
});

describe("get_court_price function", () => {
    it("should return night price after 6 PM", async () => {
        const price = await get_court_price("CourtA", new Date("2024-05-06T20:00:00Z").getHours());
        expect(price).toBe(60);
    });

    it("should return day price before 6 PM", async () => {
        const price = await get_court_price("CourtA",  new Date("2024-05-06T10:00:00Z").getHours());
        expect(price).toBe(30);
    });
});

jest.mock('../../models/users', () => {
    return {
        findOne: jest.fn()
    };
});

describe("get_user_credit function", () => {
    it("should return user's credit when user exists", async () => {
        const userData = {
            name: 'test',
            surname: 'test',
            email_address: 'test@example.com',
            password: 'test',
            credit: 100,
            type: 'member',
            emailVerified: true,
            resetCode: null,
            resetCodeExpiration: null,
            friendReqeusts: [],
            friends: []
        };

        // Mock User.findOne method to return user data
        User.findOne.mockResolvedValue(userData);

        // Call the get_user_credit function
        const credit = await get_user_credit('test@example.com');

        // Assert that User.findOne method was called with the correct arguments
        expect(User.findOne).toHaveBeenCalledWith({ email_address: 'test@example.com' });

        // Assert that the function returns the correct credit value
        expect(credit).toBe(100);
    });

    it("should throw an error when database access fails", async () => {
        // Mock User.findOne method to throw an error
        User.findOne.mockRejectedValue(new Error('Database error'));

        // Call the get_user_credit function and expect it to throw an error
        await expect(get_user_credit('test@example.com')).rejects.toThrowError('A problem was encountered while getting the user\'s credit.');
    });
});

const { is_friend } = require('../../controllers/usercontroller'); // Assuming the file name is friendController.js

describe("is_friend function", () => {
    it("should return true if the friend exists in the user's friend list", async () => {
        // Mock user data with friends
        const userData = {
            email_address: 'user@example.com',
            friends: [
                { email: 'friend1@example.com' },
                { email: 'friend2@example.com' },
                { email: 'friend3@example.com' }
            ]
        };

        // Mock User.findOne method to return user data
        User.findOne.mockResolvedValue(userData);

        // Call the is_friend function
        const isFriend = await is_friend('user@example.com', 'friend2@example.com');

        // Expect is_friend to return true since 'friend2@example.com' exists in the user's friend list
        expect(isFriend).toBe(true);
    });

    it("should return false if the friend does not exist in the user's friend list", async () => {
        // Mock user data with friends
        const userData = {
            email_address: 'user@example.com',
            friends: [
                { email: 'friend1@example.com' },
                { email: 'friend2@example.com' },
                { email: 'friend3@example.com' }
            ]
        };

        // Mock User.findOne method to return user data
        User.findOne.mockResolvedValue(userData);

        // Call the is_friend function with a friend email that doesn't exist in the user's friend list
        const isFriend = await is_friend('user@example.com', 'nonexistent@example.com');

        // Expect is_friend to return false since 'nonexistent@example.com' doesn't exist in the user's friend list
        expect(isFriend).toBe(false);
    });

    it("should throw an error if the user is not found", async () => {
        // Mock User.findOne method to return null (user not found)
        User.findOne.mockResolvedValue(null);

        // Call the is_friend function and expect it to throw an error
        await expect(is_friend('nonexistent@example.com', 'friend@example.com')).rejects.toThrowError('User not found');
    });
});