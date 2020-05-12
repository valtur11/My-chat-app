const mongoose = require('mongoose');

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
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
