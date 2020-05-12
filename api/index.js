const app = require('express')();
const PORT = 8081 || process.env.PORT;
const debug = require('debug')('My_chat_app: index.js *');
const routes = require('./routes');

app.use('/api', routes);

app.listen(PORT, () => {
  debug(`Server with pid ${process.pid} started at PORT ${PORT}`);
});