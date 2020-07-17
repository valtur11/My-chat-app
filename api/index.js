const app = require('express')();
const PORT = 8081 || process.env.PORT;
const debug = require('debug')('My_chat_app: index.js *');
const routes = require('./routes');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
const Message = require('./models/message');
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
setInterval(120000, () => {
  if(messages.length > 0){
    //save messages at db
    Message.create(messages);
    messages = [];
  }
}); //2 minute interval
function getKeyByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

io.use((socket, next) => {
  try {
    let loggedUserId = socket.handshake.query.loggedInUserId;
    console.log('loggedUserid', loggedUserId);
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
  socket.on('chat', (msg) => {
    console.log('message: ' + msg);
    messages.push({ author: getKeyByValue(users, socket.id), message: msg});
    //if the socket is online, then emit, else save to the db.
    socket.broadcast.emit('chat', msg);
  });

  socket.on('PM', (toUser, msg) => {
    console.log(`PM to ${toUser} with message: ${msg} from ${socket.loggedUserId}`);
    messages.push({ sender: socket.loggedUserId, recepient: toUser, text: msg});
    //if the socket is online, then emit, else save to the db.
    const socketId = users.get(toUser);
    socketId ? io.to(socketId).emit('PM', msg) : socket.emit('offline');
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