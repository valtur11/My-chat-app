const NODE_ENV = process.env.NODE_ENV;
const debug = require('debug')('errorHandler');
/**
 * Handles errors. It provides error stack if the server isn't in production.
 * @param {*} err
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @prop {string} process.env.NODE_ENV
 */

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const error = {
    message: err.message || 'Something went wrong.',
    status: err.status || 500
  };

  if(NODE_ENV === 'development') {
    if(err.stack) debug(err.stack);
  }

  return res.status(error.status).json({ error });
}

module.exports = errorHandler;
