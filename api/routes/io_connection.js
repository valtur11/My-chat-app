let sockets = new Set();//nicknames
let messages = [];
module.exports = (socket) => {
  sockets.add(socket);
  console.log('a user connected, sockets size:', sockets.size);
  socket.on('chat', (msg) => {
    console.log('message: ' + msg);
    messages.push({ author: socket, message: msg});
    socket.broadcast.emit('chat', msg);
  });
  socket.on('typing', () => {
    socket.broadcast.emit('typing');
  });
  socket.on('disconnect', () => {
    sockets.delete(socket);
    console.log('user disconnected, saving to the db');
  });
};