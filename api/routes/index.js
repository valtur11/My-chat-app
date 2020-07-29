const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser');
const connectDB = require('../config/mongoose');
const auth = require('../authentication');
const errorHandler = require('./errorHandler');
const cors = require('cors');
const {addFriend, getFriends} = require('../messaging/friends');
const {getMessages} = require('../messaging/messages');
const webpush = require('web-push');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { resolve } = require('path');

// Connection URL
const url = 'mongodb://localhost:27017/my-chat-app';

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:example@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
console.log('-----------------------------------------------------------------');
console.log(vapidKeys);
console.log('-----------------------------------------------------------------');
connectDB();

apiRouter.use(cors()); // @Todo: Enable CORS using whitelist
apiRouter.use(bodyParser.json());

const triggerPush = (subscription, dataToSend) => {
  return webpush.sendNotification(subscription, dataToSend)
    .then(console.log('200'))
    .catch((err) => {
      if (err.statusCode === 410) {
        MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
          assert.equal(null, err);
          const db = client.db();
          db.collection('notification_subscriptions').deleteOne({_id: subscription._id});
          client.close();
        });
      } else {
        console.log('Subscription is no longer valid: ', err);
      }
    });
};
const getSubscriptionsFromDatabase = () => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
      try{
        assert.equal(null, err);
        const db = client.db();
        const subs = await db.collection('notification_subscriptions').find({});
        resolve(subs);
      }catch(e){
        reject (e);
      }
    });
  });
};

apiRouter.post('/push', (req, res, next) => {
  return getSubscriptionsFromDatabase()
    .then((subscriptions) => {
      let promiseChain = Promise.resolve();
      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(() => {
          return triggerPush(subscription, 'lol');
        });
      }
      return promiseChain;
    })
    .then(() => {
      return res.json({ data: { success: true } });
    })
    .catch(err => {
      return next({
        error: {
          status: 500,
          id: 'unable-to-send-messages',
          message: `Failed to send the push ${err.message}`
        }
      });
    });
});

apiRouter.post('/signup', async (req, res, next) => {
  try {
    if(req.headers.authorization) throw { status: 400, message: 'Already logged in.'};
    const data = await auth.signup(req.body);
    res.status(data.status).json(data.data || data);
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/login', async (req, res, next) => {
  try {
    if(req.headers.authorization.split(' ')[1]) throw { status: 400, message: 'Already logged in.'};
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
    console.log(token);
    const decoded = auth.verifyToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/subscription', (req, res, next) => {
  if (!req.body || !req.body.endpoint) {
    return next({
      id: 'no-endpoint',
      message: 'Subscription must have an endpoint',
      status: 400
    });
  }

  // Use connect method to connect to the Server
  MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
    assert.equal(null, err);
    const db = client.db();
    return db.collection('notification_subscriptions').insertOne(req.body)
      .then((subscriptionId) => {
        res.json({ data: { success: true }});
        return client.close();
      })
      .catch((err) => {
        console.log(err);
        next({ status: 500, code: 'unable-to-save-subscription', message: 'Subscription received but failed to save it'});
      });
  });
});

apiRouter.get('/friends', async (req, res, next) => {
  try {
    const friends = await getFriends(req.decoded.email);
    res.status(200).json(friends);
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
    res.json([req.decoded.userId, [...messages]]);
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
