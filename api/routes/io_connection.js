module.exports = (socket) => {
  console.log('a user connected');
  socket.on('chat', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('chat', msg);
  });
  socket.on('typing', () => {
    socket.broadcast.emit('typing');
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
}