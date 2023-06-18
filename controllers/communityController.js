const AppError = require('../utils/newAppError');
const catchAsync = require('../utils/catchAsync');
const community = require('./../DataModel/communityModel');
const member = require('./../DataModel/memberModel');
const role = require('./../DataModel/roleModel');
const user = require('./../DataModel/userModel');
const { ObjectId } = require('mongodb');
const Snowflake = require('@theinternetfolks/snowflake/dist/index.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.getUserId = catchAsync(async (req, res, next) => {
  let token = req.headers.cookie;
  if (req.headers.cookie && req.headers.cookie.startsWith('Bearer')) {
    const cookies = req.headers.cookie.split(';');
    token = cookies
      .find((cookie) => cookie.trim().startsWith('Bearer'))
      .split('=')[1]
      .trim();
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  req.body.owner = decode.id;
  //const userId = decode.id;
  next();
});

// creating community
exports.createCommunity = catchAsync(async (req, res, next) => {
  const name = req.body.name;
  const owner = req.body.owner;
  let newCommunity = await community.find({ name, owner });
  if (!newCommunity[0]) {
    newCommunity = await community.create({ name, owner });
  } else {
    return next(new AppError('Community already existed', 200));
  }

  const roleId = await role.find({ name: 'Community Admin' });
  const newMember = await member.create({
    id: Snowflake.Snowflake.generate(),
    community: newCommunity.id,
    user: owner,
    role: roleId[0].id,
    created_at: new Date(),
  });

  res.status(200).json({
    status: true,
    content: {
      data: newCommunity,
    },
  });
});

// getting all community
exports.getAllCommunity = catchAsync(async (req, res, next) => {
  const AllCommunity = await community.find();
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: AllCommunity.length,
        pages: 1,
        page: 1,
      },
    },
    data: AllCommunity,
  });
});

// getAll members of community
exports.getAllMember = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const roleId = await role.find({ name: 'Community Member' });
  const communityMember = await member.find({
    community: id,
    role: roleId[0].id,
  });
  let ids = new Array();
  communityMember.forEach(function (member) {
    ids.push(member.user);
  });

  const Allmember = await user
    .find({ id: { $in: ids } })
    .select('-_id')
    .select('-password');
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: Allmember.length,
        pages: 1,
        page: 1,
      },
    },
    data: Allmember,
  });
});

// Get My Owned Community
exports.getMyOwnedCommunity = catchAsync(async (req, res, next) => {
  const userId = req.body.owner;
  const Mycommunity = await community.find({ owner: userId }).select('-_id');
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: Mycommunity.length,
        pages: 1,
        page: 1,
      },
    },
    data: Mycommunity,
  });
});

// Get My Joined Community
exports.getJoinedCommunity = catchAsync(async (req, res, next) => {
  // step 1 get All member in which user: yourId && role : Community Member
  const user = req.body.owner;
  const roleId = await role.find({ name: 'Community Member' });
  const getMemberData = await member.find({ user, role: roleId[0].id });
  // step 2] iterate over above data and find all the community id
  let ids = new Array();
  getMemberData.forEach(function (id) {
    ids.push(id.community);
  });
  // step 3] find all community of this id and return to the user
  const AllCommunity = await community
    .find({ id: { $in: ids } })
    .select('-_id');
  res.status(200).json({
    status: true,
    content: {
      meta: {
        total: AllCommunity.length,
        pages: 1,
        page: 1,
      },
    },
    data: AllCommunity,
  });
});
