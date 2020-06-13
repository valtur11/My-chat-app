const app = require('express')();
const PORT = 8081 || process.env.PORT;
const debug = require('debug')('My_chat_app: index.js *');
const routes = require('./routes');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, { origins: '*:*'});

app.use('/api', routes);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat2', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('chat1', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(PORT, () => {
  debug(`Server with pid ${process.pid} started at PORT ${PORT}`);
});