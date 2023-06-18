const { promisify } = require('util');
const AppError = require('../utils/newAppError');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcrypt');
// exported user model
const user = require('./../DataModel/userModel');
const date = new Date();

const correctPassword = async (candidatePassword, userPassword) => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    noTimestamp: true,
    expiresIn: '1h',
  });
};

// signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await user.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    created_at: date,
  });
  const { password, _id, ...userWithoutPassword } = newUser.toObject();
  const token = signToken(newUser._id);
  res.cookie('Bearer', token);
  res.status(201).json({
    status: true,
    content: {
      data: userWithoutPassword,
    },
    meta: {
      access_token: token,
    },
  });
});

// signin
exports.signin = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const userpassword = req.body.password;
  if (!email || !userpassword) {
    return next(new AppError('Incorrect provided Credentials', 400));
  }

  const userAuth = await user.findOne({ email }).select('+password');
  if (!userAuth || !(await correctPassword(userpassword, userAuth.password))) {
    return next(new AppError('Incorrect provided Credentials', 401));
  }

  const token = signToken(userAuth.id);
  res.cookie('Bearer', token);
  const { password, _id, ...userWithoutPassword } = userAuth.toObject();
  res.status(200).json({
    status: true,
    content: {
      data: userWithoutPassword,
      meta: {
        access_token: token,
      },
    },
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  res.cookie('Bearer', '');
  res.status(200).json({
    status: 'success',
    message: 'Log out Successfully',
  });
});

// to get user data
exports.getMe = catchAsync(async (req, res, next) => {
  let token = req.headers.cookie;
  if (req.headers.cookie && req.headers.cookie.startsWith('Bearer')) {
    const cookies = req.headers.cookie.split(';');
    token = cookies
      .find((cookie) => cookie.trim().startsWith('Bearer'))
      .split('=')[1]
      .trim();
  }

  const decode = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //const userId = decode.id;
  const myData = await user
    .find({ id: decode.id })
    .select('-password')
    .select('-_id');

  res.status(200).json({
    status: true,
    content: {
      data: myData,
    },
  });
});

// protect routes
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (req.headers.cookie && req.headers.cookie.startsWith('Bearer')) {
    token = req.headers.cookie.split('=');
  }

  if (!token) {
    return next(new AppError('Unauthorized', 401));
  }
  const decode = await promisify(jwt.verify)(token[1], process.env.JWT_SECRET);
  next();
});
