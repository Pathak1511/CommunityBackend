const express = require('express');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const morgan = require('morgan');
const AppError = require('./utils/newAppError');
const userRoutes = require('./routes/userRouter');
const communityRoutes = require('./routes/communityRouter');
const roleRoutes = require('./routes/roleRouter');
const memberRoutes = require('./routes/memberRouter');
const GlobalErrorController = require('./controllers/errorController');
const helmet = require('helmet');
const hpp = require('hpp');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
// REQUIRED MODULES
//////////////////////////////////////////

//MIDDLEWARE STACK FOR SECURITY

//SET SECURITY HTTP HEADERS
app.use(helmet());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// APPLYING LIMITER
const limiter = rateLimit({
  max: 20,
  windowMs: 60 * 30 * 1000,
  message: 'Try Again After 30 Minutes !! To many request from same IP',
});
app.use('/v1', limiter);

//BODY PARSER, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
// app.use(express.urlencoded());
//DATA SANITIZATION AGAINST NoSQL query injection
app.use(mongoSanitize());
//DATA SANITIZATION AGAINST XSS
app.use(xss());

//PREVENT PARAMETER POLLUTION
app.use(
  hpp({
    whitelist: ['size'],
  })
);

app.use(cors());

// ROUTEs
if (process.env.NODE_ENV === 'development') {
  app.use('/v1/auth', userRoutes);
  app.use('/v1/community', communityRoutes);
  app.use('/v1/role', roleRoutes);
  app.use('/v1/member', memberRoutes);
}

app.all('*', function (req, res, next) {
  const err = new AppError(`Can't find ${req.originalUrl} in this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use(GlobalErrorController);

module.exports = app;
