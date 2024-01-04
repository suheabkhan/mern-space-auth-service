import request from 'supertest';

import app from '../../src/app';
import { DataSource } from 'typeorm';
import { AppDataSource } from '../../src/config/data-source';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants/index';
import { isJwt } from '../utils';
import { RefreshToken } from '../../src/entity/RefreshToken';

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

        it('should store the hashed password in db', async () => {
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
            //check if the currentpassword is not same as hashed password
            expect(users[0].password).not.toBe(userData.password);
            //according to docs, length will be 60
            expect(users[0].password).toHaveLength(60);
            //according to docs, the password will have the following pattern
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
            //check if the hashedpassword stored is correct
        });

        it('should return 400 status if the email is not unique', async () => {
            //Arrange
            const userData = {
                firstName: 'suheab',
                lastName: 'khan',
                email: 'suheab@mern.space',
                password: 'password',
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({ ...userData, role: Roles.CUSTOMER });
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            const users = await userRepository.find();
            //Assert
            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });

        it('should add token to the cookie', async () => {
            //Arrange
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
            let accessToken: string | null = null;
            let refreshToken: string | null = null;
            //cookies are set in the headers of set-cookie
            interface Headers {
                ['set-cookie']: string[];
            }
            const cookies =
                (response.headers as unknown as Headers)['set-cookie'] || [];
            // accessToken=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.
            // eyJpZCI6MSwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjkzOTA5Mjc2LCJleHAiOjE2OTM5MDkzMzYsImlzcyI6Im1lcm5zcGFjZSJ9.
            //KetQMEzY36vxhO6WKwSR-P_feRU1yI-nJtp6RhCEZQTPlQlmVsNTP7mO-qfCdBr0gszxHi9Jd1mqf-hGhfiK8BRA_Zy2CH9xpPTBud_luqLMvfPiz3gYR24jPjDxfZJscdhE_AIL6Uv2fxCKvLba17X0WbefJSy4rtx3ZyLkbnnbelIqu5J5_7lz4aIkHjt-rb_sBaoQ0l8wE5KzyDNy7mGUf7cI_yR8D8VlO7x9llbhvCHF8ts6YSBRBt_e2Mjg5txtfBaDq5auCTXQ2lmnJtMb75t1nAFu8KwQPrDYmwtGZDkHUcpQhlP7R-y3H99YnrWpXbP8Zr_oO67hWnoCSw;
            //Max-Age=43200; Domain=localhost; Path=/; Expires=Tue, 05 Sep 2023 22:21:16 GMT; HttpOnly; SameSite=Strict
            cookies.forEach((cookie: string) => {
                if (cookie.startsWith('accessToken')) {
                    accessToken = cookie.split(';')[0].split('=')[1];
                }
                if (cookie.startsWith('refreshToken')) {
                    refreshToken = cookie.split(';')[0].split('=')[1];
                }
            });
            expect(accessToken).not.toBeNull();
            expect(refreshToken).not.toBeNull();

            expect(isJwt(String(accessToken))).toBeTruthy();
            expect(isJwt(String(refreshToken))).toBeTruthy();
        });
        it('should store the refresh token in the database', async () => {
            // Arrange
            const userData = {
                firstName: 'Rakesh',
                lastName: 'K',
                email: 'rakesh@mern.space',
                password: 'password',
            };

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);

            // Assert
            const refreshTokenRepo = connection.getRepository(RefreshToken);
            // const refreshTokens = await refreshTokenRepo.find();

            const tokens = await refreshTokenRepo
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();

            expect(tokens).toHaveLength(1);
        });
    });

    describe('Fields are missing', () => {
        it('should return 400 status code if email field is missing', async () => {
            //Arrange
            const userData = {
                firstName: 'suheab',
                lastName: 'khan',
                password: 'password',
            };
            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(userData);
            //Assert
            expect(response.statusCode).toBe(400);
        });
    });
});
