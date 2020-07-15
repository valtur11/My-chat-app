const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser');
const connectDB = require('../config/mongoose');
const auth = require('../authentication');
const errorHandler = require('./errorHandler');
const cors = require('cors');
const {addFriend} = require('../messaging/friends');
const {getMessages} = require('../messaging/messages');

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

apiRouter.use((req, res,next) => {
  try {
    const authError = new Error('Please, login first');
    authError.status = 401;
    if(!req.headers.authorization) throw authError;
    const token = req.headers.authorization.split(' ')[1];
    const decoded = auth.verifyToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/friends', async (req, res, next) => {
  try {
    const friend = await addFriend(req.decoded.email, req.body.email);
    res.status(200).json(friend);
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/messages/:fromUserId', async (req, res, next) => {
  try {
    const messages = await getMessages(req.decoded.userId, req.params.fromUserId);
    res.json(messages);
    //getMessages
  } catch (error) {
    next(error);
  }
});

apiRouter.use((req, res, next) => {
  next({ status: 404, message: 'Not Found' });
});

apiRouter.use(errorHandler);

module.exports = apiRouter;
