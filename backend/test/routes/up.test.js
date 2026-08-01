const request = require('supertest');
const app = require('../../src/index');

// The databases health check needs a live Postgres and Redis, which only exist
// when the app runs through Docker Compose. `./run test` sets RUN_DB_TESTS so
// it runs there; the CI pipeline has no service containers, so it skips.
const describeDatabases = process.env.RUN_DB_TESTS ? describe : describe.skip;

describe('Test the up routes', () => {
  test('Index should return a status code 200', (done) => {
    request(app)
      .get('/up/')
      .expect(200, done);
  });
});

describeDatabases('Test the up routes that need the databases', () => {
  test('Databases should return a status code 200', (done) => {
    request(app)
      .get('/up/databases')
      .expect(200, done);
  });
});
