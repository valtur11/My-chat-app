const express = require('express');
const apiRouter = express.Router();
const bodyParser = require('body-parser');
const connectDB = require('../config/mongoose');
const auth = require('../authentication');
const errorHandler = require('./errorHandler');
const cors = require('cors');
const {addFriend, getFriends, blockFriend, muteFriend} = require('../messaging/friends');
const {getMessages} = require('../messaging/messages');
const webpush = require('web-push');
const debug = require('debug')('index routes');
const User = require('../models/user');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const { resolve } = require('path');

// Connection URL
const url = process.env.MONGO_URL || 'mongodb://localhost:27017/my-chat-app';

const vapidKeys = {
  publicKey: process.env.VAPID_PUBLIC_KEY,
  privateKey: process.env.VAPID_PRIVATE_KEY
};

webpush.setVapidDetails(
  'mailto:example@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);
debug('-----------------------------------------------------------------');
debug(vapidKeys);
debug('-----------------------------------------------------------------');
connectDB();

apiRouter.use(cors()); // @Todo: Enable CORS using whitelist
apiRouter.use(bodyParser.json());

const triggerPush = (subscription, dataToSend) => {
  return webpush.sendNotification(subscription, dataToSend)
    .then(debug('200'))
    .catch((err) => {
      if (err.statusCode === 410) {
        debug(410);
        /* MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
          assert.equal(null, err);
          const db = client.db();
          db.collection('notification_subscriptions').deleteOne({_id: subscription._id});
          client.close();
        });*/
      } else if(err.code === 'EAI_AGAIN') {
        debug('EAI_AGAIN');
        /* MongoClient.connect(url, { useUnifiedTopology: true }, function(err, client) {
          assert.equal(null, err);
          const db = client.db();
          db.collection('notification_subscriptions').deleteOne({_id: subscription._id});
          client.close();
        });*/
      } else {
        debug('Subscription is no longer valid');
      }
    });
};
const getSubscriptionsFromDatabase = (query) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
      try{
        assert.equal(null, err);
        const db = client.db();
        const subs = await db.collection('notification_subscriptions').find(query).toArray();
        resolve(subs);
        client.close();
      }catch(e){
        reject (e);
        client.close();
      }
    });
  });
};

apiRouter.post('/push', async (req, res, next) => {
  debug('Push');
  const search = req.body.recepient ? {userId: req.body.recepient} : {};
  await Promise.all([User.findOne({_id: req.body.sender}), getSubscriptionsFromDatabase(search)])
    .then(([sender, subscriptions]) => {
      let promiseChain = Promise.resolve();
      for (let i = 0; i < subscriptions.length; i++) {
        const subscription = subscriptions[i];
        promiseChain = promiseChain.then(() => {
          debug(JSON.stringify({...req.body, senderEmail: sender.email}));
          return triggerPush(subscription, JSON.stringify({...req.body, senderEmail: sender.email}) || 'That is a new message');
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
    if(req.headers.authorization.split(' ')[1]) throw { status: 400, message: 'Already logged in.'};
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

apiRouter.post('/change-password', async (req, res, next) => {
  try {
    const data = await auth.changePassword(req.body.email, req.body.password);
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
    debug(token);
    const decoded = auth.verifyToken(token);
    req.decoded = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/subscription', (req, res, next) => {
  try {
    if (!req.body || !req.body.endpoint) {
      return next({
        id: 'no-endpoint',
        message: 'Subscription must have an endpoint',
        status: 400
      });
    }

    return MongoClient.connect(url, { useUnifiedTopology: true }, async function(err, client) {
      try {
        if(err) throw err;
        const db = client.db();
        await db.collection('notification_subscriptions').createIndex( { endpoint: 1 }, {unique:true} );
        debug('Right before insertion');
        await db.collection('notification_subscriptions').insertOne({userId: req.decoded.userId, ...req.body});
        res.json({ data: { success: true }});
        return client.close();
      } catch(error) {
        (error.code === 11000) ? next({status: 400, code: error.code, message: 'Already subscribed'})
          : next({ status: 500, code: 'unable-to-save-subscription', message: 'Subscription received but failed to save it'});
        return client.close();
      }
    });
  } catch(e){
    next(e);
  }
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

apiRouter.get('/block/:blockedUserId', async (req, res, next) => {
  try {
    const friend = await blockFriend(req.decoded.userId, req.params.blockedUserId);
    res.status(200).json(friend);
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/mute/:mutedUserId', async (req, res, next) => {
  try {
    const friend = await muteFriend(req.decoded.userId, req.params.mutedUserId);
    res.status(200).json(friend);
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/messages/:fromUserId', async (req, res, next) => {
  try {
    const messages = await getMessages(req.decoded.userId, req.params.fromUserId);
    res.json([[req.decoded.userId, messages[0]], [...messages[1]]]);
    //getMessages
  } catch (error) {
    debug(error);
    next(error);
  }
});

apiRouter.use((req, res, next) => {
  next({ status: 404, message: 'Not Found' });
});

apiRouter.use(errorHandler);

module.exports = apiRouter;
