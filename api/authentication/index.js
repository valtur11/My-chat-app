const createAuthMethods = require('./createAuthMethods');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'This SECRET will be moved to .env file';
const User = require('../models/user');

const dependecies = { jwt, env: { JWT_SECRET, ...process.env }, user: User };
const auth = createAuthMethods(dependecies);

module.exports = Object.freeze(auth);
