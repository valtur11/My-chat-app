const Message = require('../models/message');
const User = require('../models/user');

const getMessages = async (recepient, sender) => {
  function getDayMonthYearString(iso_Date_string) {
    const date = new Date(iso_Date_string);
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  }
  const [recepientBlocks, [senderBlocks, senderEmail], messages] = await Promise.all([
    await User.findOne({_id: recepient}, {blocked: 1}),
    await User.findOne({_id: sender}, {blocked: 1, email: 1}),
    await Message.find({ recepient: { $in: [recepient, sender]}, sender : { $in: [recepient, sender]}}).limit(100)
  ])
    .then(vals => [vals[0].blocked, [vals[1].blocked, [vals[1].email]], vals[2]])
    .catch(err => { throw err; });
  const isBlockedR = recepientBlocks.find(el => el === sender);
  const isBlockedS = senderBlocks.find(el => el === recepient);
  if(isBlockedR || isBlockedS) throw { status: 403, message: 'User banned or blocked'};
  let messagesByDay = []; // [Day1,Day2,Day3, [Day, [message(val)]]]
  let byDayI = -1;
  let lastISOString = new Date(0).toISOString();
  messages.forEach(val =>{
    //val.createdAt.DayOfMonthMonthYear === messages[i-1]
    //if 1 then continue to add to current subarray
    // if 0 then add to next subarray
    const currentDateString = getDayMonthYearString(val.createdAt);
    const previousDateString = getDayMonthYearString(lastISOString);
    if(currentDateString !== previousDateString) {
      byDayI += 1;
      messagesByDay[byDayI] = [currentDateString, []];
    }
    lastISOString = val.createdAt;
    messagesByDay[byDayI][1].push(val);
  });
  return [senderEmail, messagesByDay];
};

module.exports = {getMessages};