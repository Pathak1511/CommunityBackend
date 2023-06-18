const mongoose = require('mongoose');
const Snowflake = require('@theinternetfolks/snowflake/dist/index.js');
// REQUIRED MODULES
//////////////////////////////////////////

const roleSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'role name is required'],
    unique: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

roleSchema.pre('save', async function (next) {
  this.id = Snowflake.Snowflake.generate();
  next();
});

const role = mongoose.model('Role', roleSchema);

module.exports = role;
