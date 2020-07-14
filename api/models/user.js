const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;
//eslint-disable-next-line
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const userSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 254,
    match: emailRegex
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 100
  },
  friends: [{
    type: Schema.Types.ObjectId, ref: 'User'
  }],
  messages: [{
    type: Schema.Types.ObjectId, ref: 'Message'
  }]
});

userSchema.pre('save', async function (next) {
  try {
    if(!this.isModified('password')) {
      return next();
    }

    const hashedPassword = await bcrypt.hash(this.password, 10);
    this.password = hashedPassword;
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword, next) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    return isMatch;
  } catch (error) {
    next(error);
  }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
