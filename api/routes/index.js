const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser');

const auth = require('../authentication');

apiRouter.use(bodyParser.json());

apiRouter.post('/signup', async (req, res, next) => {
  res.json({ signupstatus: 'pending' });
});

apiRouter.post('/login', async (req, res, next) => {
  const data = await auth.login(req.body.email, req.body.password);
  res.status(data.status).json(data.data);
});

apiRouter.use((req, res, next) => {
  res.json({ status: 404, message: 'Not Found' });
});

module.exports = apiRouter;
