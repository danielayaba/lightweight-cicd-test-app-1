const redis = require('redis');
const config = require('../config/index');

function createClient() {
  const client = redis.createClient(config.redis);

  // Without a listener, an 'error' event from the client is unhandled and takes
  // the whole process down, which is how a Redis blip turns into an outage.
  // Log it instead and let the client go on retrying.
  client.on('error', (error) => {
    console.error(`Redis client error: ${error.message}`);
  });

  return client;
}

// There is no Redis server under test, and a client left dialling a host that
// isn't there keeps logging after the suite has finished. The tests that do
// exercise Redis are gated behind RUN_DB_TESTS and run through Docker Compose,
// where NODE_ENV is development, so they get a real client.
const testClient = { ping: () => {}, quit: () => {} };

module.exports = process.env.NODE_ENV === 'test' ? testClient : createClient();
