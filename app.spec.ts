import app from '../auth-service/src/app';
import request from 'supertest';

describe('App', () => {
    it('should work', () => {});

    it('Should return 200', async () => {
        const response = await request(app).get('/test').send();
        expect(response.statusCode).toBe(200);
    });
});
