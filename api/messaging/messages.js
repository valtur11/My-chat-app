const Message = require('../models/message');

const getMessages = async (recepient, sender) => {
  const now = new Date();
  const dates = [new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getDay(), 0, 0).toISOString(), now.toISOString()]
  const messages = await Message.find({ createdAt: {$gte: dates[0], $lt: dates[1]}, recepient: { $in: [recepient, sender]}, sender : { $in: [recepient, sender]}});
  return messages;
};

module.exports = {getMessages};