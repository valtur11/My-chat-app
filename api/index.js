const app = require('express')();
const PORT = 8081 || process.env.PORT;
const debug = require('debug')('My_chat_app: index.js *');
const routes = require('./routes');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server);
io.set('origins', '*:*'); //@TODO only to server
// const io_connection = require('./routes/io_connection');

const auth = require('./authentication');

app.use('/api', routes);

let users = new Map();//nicknames
let messages = [];

function getKeyByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue)
      return key;
  }
}

io.use((socket, next) => {
  try {
    let token = socket.handshake.query.token;
    const decoded = auth.verifyToken(token);
    socket.username = decoded.email;
    users.set(socket.username, socket.id);
    return next();
    //socket.friends
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
    console.log(`PM to ${toUser} with message: ${msg} from ${getKeyByValue(users, socket.id)}`);
    messages.push({ author: getKeyByValue(users, socket.id), message: msg});
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

server.listen(PORT, () => {
  debug(`Server with pid ${process.pid} started at PORT ${PORT}`);
});