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

// Express applications do not come with security HTTP headers out of the box.
//SET SECURITY HTTP HEADERS
app.use(helmet());

// DEVELOPMENT LOGGING
if (process.env.NODE_ENV === 'development') {
  // output as {{ method :url :status :res[content-length] - :response-time ms }}
  app.use(morgan('dev'));
}

// APPLYING LIMITER
// technique used to control the number of requests made to an API or server from a particular IP address within a specified time window
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
//  security measure used to sanitize user input and prevent potential NoSQL injection attacks.
//  designed to sanitize and remove any characters or strings from user input that could potentially have an impact on MongoDB queries.
app.use(mongoSanitize());
//DATA SANITIZATION AGAINST XSS
// middleware is a security measure used to sanitize user input and prevent potential cross-site scripting (XSS) attacks
app.use(xss());

//PREVENT PARAMETER POLLUTION
// middleware is a security measure used to prevent HTTP parameter pollution attacks. HTTP parameter pollution occurs when an attacker manipulates the parameters sent to a server to exploit vulnerabilities or disrupt the application's functionality.
app.use(
  hpp({
    whitelist: ['size'],
  })
);

// CORS is a mechanism that allows a web server to specify who can access its resources on a web page from a different domain
app.use(cors());

// ROUTEs
app.use('/v1/auth', userRoutes);
app.use('/v1/community', communityRoutes);
app.use('/v1/role', roleRoutes);
app.use('/v1/member', memberRoutes);

app.all('*', function (req, res, next) {
  const err = new AppError(`Can't find ${req.originalUrl} in this server!`);
  err.status = 'fail';
  err.statusCode = 404;
  next(err);
});

app.use(GlobalErrorController);

module.exports = app;
