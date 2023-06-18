const express = require('express');
const router = express.Router();
const roleController = require('./../controllers/roleController');
const userAuth = require('./../controllers/authController');
// get all and create method
router
  .route('/')
  .get(userAuth.protect, roleController.getAllrole)
  .post(userAuth.protect, roleController.createRole);

module.exports = router;
