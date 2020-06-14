const app = require('express')();
const PORT = 8081 || process.env.PORT;
const debug = require('debug')('My_chat_app: index.js *');
const routes = require('./routes');
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, { origins: '*:*'});
const io_connection = require('./routes/io_connection');

app.use('/api', routes);

io.on('connection', io_connection);

server.listen(PORT, () => {
  debug(`Server with pid ${process.pid} started at PORT ${PORT}`);
});