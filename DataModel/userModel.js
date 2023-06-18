const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Snowflake = require('@theinternetfolks/snowflake/dist/index.js');
// REQUIRED MODULES
//////////////////////////////////////////

const userSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'name is required'],
    default: null,
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, 12);
  this.id = Snowflake.Snowflake.generate();
  next();
});

const user = mongoose.model('User', userSchema);

module.exports = user;
