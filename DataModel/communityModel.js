const mongoose = require('mongoose');
const Snowflake = require('@theinternetfolks/snowflake/dist/index.js');
const slug = (community_name) => {
  return community_name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};
// REQUIRED MODULES
//////////////////////////////////////////

const communitySchema = new mongoose.Schema({
  ///////////////////
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  slug: {
    type: String,
    unique: true,
  },
  owner: {
    type: String,
    required: [true, 'owner is required'],
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

communitySchema.pre('save', async function (next) {
  this.slug = await slug(this.name);
  this.id = Snowflake.Snowflake.generate();
  next();
});

const community = mongoose.model('Community', communitySchema);

module.exports = community;
