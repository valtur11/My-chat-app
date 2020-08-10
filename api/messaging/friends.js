const User = require('../models/user');

/**
 * @param emailActive the email of the person who adds the friend
 * @param emailPassive the email of the new friend
 */
const addFriend = (emailActive, emailPassive) => {
  return Promise.all([User.findOne({email: emailActive}), User.findOne({email: emailPassive})])
    .then(async ([userActive, userPassive]) => {
      if(!userPassive) {
        throw { status: 400, errorType: 'no-such-account', message: `There is no such account ${emailPassive}`};
      }
      if(userActive && userPassive) {
        if(userActive.friends.includes(userPassive._id)) {
          throw {status: 400,  message: `already added ${emailPassive}`};
        } else {
          userActive.friends.push(userPassive._id);
          await userActive.save();
          return { message: `added ${emailPassive}`};
        }
      }
      return { message: 'Please, login first.'};
    })
    .catch(error => {
      throw error;
    });
};

const getFriends = async (email) => {
  const foundUser = await User.findOne({email}).populate('friends');
  return foundUser.friends;
};

const blockFriend = async(userId, blockedUserId) => {
  const foundUser = await User.findOne({_id: userId}, {blocked: 1});
  const blocked = foundUser.blocked.find(blockedUserId);
  if(blocked) {
    const i = foundUser.blocked.indexOf(blockedUserId);
    if (i > -1) foundUser.blocked.splice(i, 1);
  } else {
    foundUser.blocked.push(blockedUserId);
  }
  await foundUser.save();
  return foundUser;
};

const muteFriend = async(userId, mutedUserId) => {
  const foundUser = await User.findOne({_id: userId}, {muted: 1});
  const blocked = foundUser.muted.find(mutedUserId);
  if(blocked) {
    const i = foundUser.muted.indexOf(mutedUserId);
    if (i > -1) foundUser.muted.splice(i, 1);
  } else {
    foundUser.muted.push(mutedUserId);
  }
  await foundUser.save();
  return foundUser;
};

module.exports = { addFriend, getFriends, blockFriend, muteFriend };