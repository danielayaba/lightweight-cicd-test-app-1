const request = require('supertest');
const app = require('../../src/index');

describe('Test the health route', () => {
  test('Health should return a status code 200', (done) => {
    request(app)
      .get('/health')
      .expect(200, done);
  });

  // The pipeline reads uptimeSeconds out of this response to tell a freshly
  // deployed container from the previous one, so the field has to be there and
  // has to be a number.
  test('Health should report the process uptime in seconds', async () => {
    const response = await request(app).get('/health');

    expect(response.body.status).toBe('ok');
    expect(typeof response.body.uptimeSeconds).toBe('number');
    expect(response.body.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});
