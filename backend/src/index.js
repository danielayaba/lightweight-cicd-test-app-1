const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const morgan = require('morgan');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);

const app = express();
const pages = require('./routes/pages');
const up = require('./routes/up');
const health = require('./routes/health');
const config = require('../config');
const redis = require('./redis');

app.use(morgan('common'));

// Mounted ahead of the session middleware on purpose: a liveness probe that
// goes through the session store would start failing whenever Redis does, and
// the pipeline would read that as a deployment that never came up.
app.use('/health', health);

// Sessions live in Redis everywhere except under test, where no Redis server
// is running (the CI pipeline executes jest without service containers).
// Passing no store falls back to the in-memory store built into express-session.
const sessionStore = process.env.NODE_ENV === 'test'
  ? undefined
  : new RedisStore({ client: redis });

app.use(
  session({
    store: sessionStore,
    secret: config.express.secret,
    resave: false,
    saveUninitialized: false,
  }),
);

app.use(express.static('../public'));

app.use(expressLayouts);
app.set('layout', './layouts/app');
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/up/', up);
app.use('/', pages);

module.exports = app;
