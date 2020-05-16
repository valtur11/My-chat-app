const mongoose = require('mongoose');
const dbUri = 'mongodb://localhost:27017/my-chat-app';

function startMongooseConnection() {
  //@todo make this conn function

  mongoose.set('debug', true);
  mongoose.Promise = Promise;
  mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
    .catch(err => console.log(err));
  mongoose.connection.on('error', err => {
    console.log(err);
  });
}

module.exports = startMongooseConnection;