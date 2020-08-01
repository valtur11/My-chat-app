const path = require('path');
require('dotenv').config();
const app = require('express')();
const PORT = process.env.PORT || 8081;
const debug = require('debug')('My_chat_app: index.js');
const routes = require('./routes');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const Message = require('./models/message');
const axios = require('axios');
/**
 * Serving Express apiRouter
 */
app.use('/api', routes);

/**
 * Socket.io event handlers
 * @TODO if the recepient is offline, then save the messages at the db.
 */
io.set('origins', '*:*'); //@TODO only to server

let users = new Map();//nicknames
let messages = [];

/**
 * utility function; getting object's key by value
 */
setInterval(() => {
  if(messages.length > 0){
    //save messages at db
    Message.create(messages);
    messages = [];
  }
}, 1000); //2 minute interval 120000 changed to 1 sec (1000ms)
function getKeyByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

io.use((socket, next) => {
  try {
    let loggedUserId = socket.handshake.query.loggedInUserId;
    debug('loggedUserid', loggedUserId);
    if (loggedUserId) socket.loggedUserId = loggedUserId;
    users.set(socket.loggedUserId, socket.id);
    return next();
  } catch (e) {
    return next();
  }
});
io.on('connection', (socket) => {
  if(getKeyByValue(users, socket.id) === undefined){
    // auth error
    socket.disconnect();
  }
  //a user connected, retrieve its messages from the db.
  console.log('a user connected, sockets size:', users.size, socket.id);

  //Deprecated
  socket.on('chat', (msg) => {
    console.log('message: ' + msg);
    messages.push({ author: getKeyByValue(users, socket.id), message: msg});
    //if the socket is online, then emit, else save to the db.
    socket.broadcast.emit('chat', msg);
  });

  socket.on('PM', (toUser, msg) => {
    const message = { sender: socket.loggedUserId, recepient: toUser, text: msg, createdAt: Date.parse(new Date()) };
    console.log(`PM to ${toUser} with message: ${msg} from ${socket.loggedUserId}`);
    messages.push(message);
    //if the socket is online, then emit, else save to the db.
    const socketId = users.get(toUser);
    if(socketId) {
      io.to(socketId).emit('PM', message);
    } else{
      console.log('offline');
      socket.emit('offline');
      axios.post(`${process.env.base_api_url}/push`, message).then(() => console.log('OK.PUSHED.')).catch(e => console.log(e));
    }
  });

  socket.on('typing', () => {
    socket.broadcast.emit('typing');
  });

  socket.on('disconnect', () => {
    users.delete(socket.username);
    console.log('user disconnected, saving to the db');
  });
});

/**
 * Listening for Express or Socket.io requests
 */
server.listen(PORT, () => {
  debug(`Server with pid ${process.pid} started at PORT ${PORT}`);
});