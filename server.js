const dotenv = require('dotenv');
const mongoose = require('mongoose');

// error in the application code that is not caught and handled by any error handling middleware or route handlers
// This could be due to various reasons, such as a programming error or an unexpected condition
process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: '.env' });
const app = require('./app');
// REQUIRED MODULES
//////////////////////////////////////////

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true, // tells Mongoose to use the new URL parser instead of the deprecated one
    useCreateIndex: true, // enables the use of the createIndex() function for creating indexes.
    useFindAndModify: false, // tells Mongoose to use the native findOneAndUpdate() instead of the deprecated findAndModify()
    useUnifiedTopology: true, // enables the use of the new MongoDB unified topology engine.
  })
  .then(() => console.log('DB connection successfull'));

const port = 5500 | process.env.PORT;

const server = app.listen(port, () => {
  console.log(`App running on port ${port} in ${process.env.NODE_ENV}`);
});

// for promise rejection
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
