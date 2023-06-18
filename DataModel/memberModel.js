const mongoose = require('mongoose');
const Snowflake = require('@theinternetfolks/snowflake/dist/index.js');
// REQUIRED MODULES
//////////////////////////////////////////

const memberSchema = new mongoose.Schema({
  ///////////////////
  id: {
    type: String,
    unique: true,
    required: true,
  },
  community: {
    type: String,
    required: [true, 'community id is required'],
  },
  user: {
    type: String,
    required: [true, 'user id is required'],
  },
  role: {
    type: String,
    required: [true, 'role id is required'],
  },
  created_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// memberSchema.pre('save', async function (next) {
//   this.id = Snowflake.Snowflake.generate();
//   next();
// });

const member = mongoose.model('Member', memberSchema);

module.exports = member;
