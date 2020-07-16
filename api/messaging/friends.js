const User = require('../models/user');

/**
 * @param emailActive the email of the person who adds the friend
 * @param emailPassive the email of the new friend
 */
const addFriend = (emailActive, emailPassive) => {
  return Promise.all([User.findOne({email: emailActive}), User.findOne({email: emailPassive})])
    .then(async ([userActive, userPassive]) => {
      if(!userPassive) {
        return { message: `There is no such account ${emailPassive}`};
      }
      if(userActive && userPassive) {
        if(userActive.friends.includes(userPassive._id)) {
          return { message: `already added ${emailPassive}`};
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

module.exports = {addFriend, getFriends};