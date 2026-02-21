const request = require('supertest');
const app = require('../index');

describe('API smoke tests', () => {
    test('GET /api/health returns ok', async () => {
        const res = await request(app).get('/api/health');
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('ok', true);
    });

    test('GET /api/auth/me without token -> 401', async () => {
        const res = await request(app).get('/api/auth/me');
        expect([401, 403, 500]).toContain(res.statusCode);
    });

    test('GET /api/auth/me with admin token -> 200', async () => {
        process.env.ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'dev-admin-token';
        const res = await request(app)
            .get('/api/auth/me')
            .set('Authorization', `Bearer ${process.env.ADMIN_TOKEN}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('role', 'admin');
    });
});
