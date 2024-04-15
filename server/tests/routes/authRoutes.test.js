// const bcrypt = require('bcryptjs');
// const app = require('../../index'); // Import your Express app
// const User = require('../../models/users'); // Import your User model
// const request = require('supertest');

// // Mock user data
// const mockUserData = {
//     email: 'jacob.ellul.22@um.edu.mt',
//     password: '1234',
//     name: 'Jacob',
//     surname: 'Ellul',
//     credit: 0,
//     type: 'member'
// };

// // Set up a test database or mock your database calls
// // ...

// describe('POST /login', () => {
//     it('should login successfully with correct credentials', async () => {
//         // Here you'd mock the findOne and compare calls
//         User.findOne = jest.fn().mockResolvedValue(mockUserData);
//         bcrypt.compare = jest.fn().mockResolvedValue(true);

//         const response = await request(app)
//             .post('/login')
//             .send({ email: mockUserData.email, password: mockUserData.password });

//         expect(response.statusCode).toBe(200);
//     });

//     it('should fail login with incorrect credentials', async () => {
//         // Mock findOne to return the user and compare to return false
//         User.findOne = jest.fn().mockResolvedValue(mockUserData);
//         bcrypt.compare = jest.fn().mockResolvedValue(false);

//         const response = await request(app)
//             .post('/login')
//             .send({ email: mockUserData.email, password: 'wrongpassword' });

//         expect(response.statusCode).toBe(401);
//     });
// });

// describe('POST /signup', () => {
//     it('should create a new user and return success message', async () => {
//         // Mock User.exists to return false and the create_user function
//         User.exists = jest.fn().mockResolvedValue(false);
//         exports.create_user = jest.fn().mockResolvedValue(mockUserData);

//         const response = await request(app)
//             .post('/signup')
//             .send(mockUserData);

//         expect(response.statusCode).toBe(201);
//         expect(response.body.email).toBe(mockUserData.email);
//     });

//     it('should return an error if the email already exists', async () => {
//         // Mock User.exists to return true
//         User.exists = jest.fn().mockResolvedValue(true);

//         const response = await request(app)
//             .post('/signup')
//             .send(mockUserData);

//         expect(response.statusCode).toBe(400);
//         expect(response.body.error).toBeDefined();
//     });
// });