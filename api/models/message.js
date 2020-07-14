const mongoose = require('mongooose');

const Schema = mongoose.Schema;

const messageSchema = Schema({
  text: {
    type: String,
    maxlength: 600
  },
  createdAt: {
    type: Date
  },
  recepient: {
    type: Schema.Types.ObjectId, ref: 'User'
  },
  sender: {
    type: Schema.Types.ObjectId, ref: 'User'
  }
});

messageSchema.pre('save', async function (next) {
  try {
    this.createdAt = new Date();
  } catch (error) {
    return next(error);
  }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;