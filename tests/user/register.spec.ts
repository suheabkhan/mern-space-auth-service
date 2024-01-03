import request from 'supertest';

import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants/index';

describe('POST /auth/register', () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        // truncate database
        await connection.dropDatabase();
        await connection.synchronize();
        //rebuild the database, as we need to synchroize the db if a new column is added/removed
    });

    afterAll(async () => {
        await connection.destroy();
    });

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
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users).toHaveLength(1);
            expect(users[0].firstName).toEqual(userData.firstName);
            expect(users[0].lastName).toEqual(userData.lastName);
            expect(users[0].email).toEqual(userData.email);
        });

        it('should assign a customer role', async () => {
            const userData = {
                firstName: 'suheab',
                lastName: 'khan',
                email: 'suheab@mern.space',
                password: 'password',
            };
            // Act
            await request(app).post('/auth/register').send(userData);
            //Assert
            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();
            expect(users[0]).toHaveProperty('role');
            expect(users[0].role).toBe(Roles.CUSTOMER);
        });
    });

    describe('Fields are missing', () => {});
});
