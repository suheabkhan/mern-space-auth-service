import request from 'supertest';

import app from '../../src/app';

describe('POST /auth/register', () => {
    describe('Given all fields', () => {
        it('should return the status code as 201', async () => {
            //Arrange
            const userData = {
                firstName: 'suheab',
                lastName: 'khan',
                email: 'suheab@mern.space',
                password: 'password',
            };
            //Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            // Assert
            expect(response.statusCode).toBe(201);
        });

        it('should return valid json response', async () => {
            // Arrange
            const userData = {
                firstName: 'suheab',
                lastName: 'khan',
                email: 'suheab@mern.space',
                password: 'password',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert application/json utf-8
            expect(
                (response.headers as Record<string, string>)['content-type'],
            ).toEqual(expect.stringContaining('json'));
        });

        it('should persist the data in the db', async () => {
            // Arrange
            const userData = {
                firstName: 'suheab',
                lastName: 'khan',
                email: 'suheab@mern.space',
                password: 'password',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            //Assert
        });
    });

    describe('Fields are missing', () => {});
});
