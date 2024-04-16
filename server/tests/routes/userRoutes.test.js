const request = require('supertest');
const express = require('express');
const bcrypt = require('bcryptjs');
const router = require('../../routes/userRoutes');
const User = require('../../models/users');

const app = express();
app.use(express.json());
app.use(router);

jest.mock('../../models/users', () => ({
    findOne: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
    compare: jest.fn(),
}));

describe('Login endpoint', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return success response for valid login', async () => {
        const mockUser = {
            name: 'test',
            surname: 'test',
            email_address: 'test@test.test',
            password: 'testpwd',
            credit: 100,
            type: 'member'
        };

        require('../../models/users').findOne.mockResolvedValue(mockUser);

        bcrypt.compare.mockResolvedValue(true);

        const response = await request(app)
            .post('/login')
            .send({ email: 'test@test.test', password: 'testpwd' });
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            message: 'Login successful',
            email: 'test@test.test',
            type: 'member',
            password: 'testpwd',
            credit: 100,
            name: 'test',
            surname: 'test',
        });
    });
});