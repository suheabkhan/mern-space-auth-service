import { DataSource } from 'typeorm';
import request from 'supertest';
import { AppDataSource } from '../../src/config/data-source';
import app from '../../src/app';
import { User } from '../../src/entity/User';
import { Roles } from '../../src/constants';
import createJWKSMock from 'mock-jwks';

describe('POST /auth/self', () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501');
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterEach(() => {
        jwks.stop();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe('Given all fields', () => {
        it('should return the 200 status code', async () => {
            // Act
            const accessToken = jwks.token({
                sub: '1',
                role: Roles.CUSTOMER,
            });
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();

            expect(response.statusCode).toBe(200);
        });

        it('should return the user data', async () => {
            //first register the data to validate the data
            // Arrange
            const userData = {
                firstName: 'suheab',
                lastName: 'khan',
                email: 'suheab@mern.space',
                password: 'password',
            };
            // Act
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });
            //Generate token --> for this we will use mock-jws library for testing (will use 1.0.10)
            //could have done register API calling, that would have automatically given the token, but to
            //isolate the things, we are using the mock-jwks library
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });
            //since, we are testing manually, need to add the cookie manually here
            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send();
            //assert whether the user id matches that of the user registered
            expect((response.body as Record<string, string>).id).toBe(1);
        });
    });
});
