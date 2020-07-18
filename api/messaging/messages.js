const Message = require('../models/message');

const getMessages = async (recepient, sender) => {
  const messages = await Message.find({recepient: { $in: [recepient, sender]}, sender : { $in: [recepient, sender]}});
  return messages;
};

module.exports = {getMessages};