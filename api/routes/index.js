const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser');
const connectDB = require('../config/mongoose');
const auth = require('../authentication');
const errorHandler = require('./errorHandler');
const cors = require('cors');
const {addFriend} = require('../messaging/friends');

connectDB();

apiRouter.use(cors()); // @Todo: Enable CORS using whitelist
apiRouter.use(bodyParser.json());

apiRouter.post('/signup', async (req, res, next) => {
  try {
    const data = await auth.signup(req.body);
    res.status(data.status).json(data.data || data);
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/login', async (req, res, next) => {
  try {
    const data = await auth.login(req.body.email, req.body.password);
    res.status(data.status).json(data.data || data);
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/friends', async (req, res, next) => {
  try {
    //@TODO: get this email from auth middleware
    req.decoded = { email: 'techie@techie.com' };
    const friend = await addFriend(req.decoded.email, req.body.email);
    res.status(200).json(friend);
  } catch (error) {
    next(error);
  }
});

apiRouter.use((req, res, next) => {
  next({ status: 404, message: 'Not Found' });
});

apiRouter.use(errorHandler);

module.exports = apiRouter;
