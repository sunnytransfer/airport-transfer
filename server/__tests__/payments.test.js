const request = require('supertest');
const app = require('../index');

describe('Payment Feature Flag logic', () => {

    test('arrival booking works', async () => {
        const res = await request(app)
            .post('/api/bookings')
            .send({
                customer_name: "Test Arrival Booking",
                email: "test@example.com",
                phone: "123456",
                pickup_location: "A",
                dropoff_location: "B",
                pickup_time: "2023-12-01T10:00:00Z",
                payment_method: "arrival"
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Booking created successfully");
    });

    test('online booking blocked when disabled', async () => {
        // Ensure payments are disabled first
        await request(app)
            .put('/api/admin/settings/payments')
            .send({ enabled: false })
            .expect(200);

        const res = await request(app)
            .post('/api/bookings')
            .send({
                customer_name: "Test Online Booking Blocked",
                email: "test@example.com",
                phone: "123456",
                pickup_location: "A",
                dropoff_location: "B",
                pickup_time: "2023-12-01T10:00:00Z",
                payment_method: "online"
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.error).toMatch(/disabled/i);
    });

    test('enable payments and online booking allowed', async () => {
        // Enable payments
        await request(app)
            .put('/api/admin/settings/payments')
            .send({ enabled: true })
            .expect(200);

        const res = await request(app)
            .post('/api/bookings')
            .send({
                customer_name: "Test Online Booking Allowed",
                email: "test@example.com",
                phone: "123456",
                pickup_location: "A",
                dropoff_location: "B",
                pickup_time: "2023-12-01T10:00:00Z",
                payment_method: "online"
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Booking created successfully");
    });

});
