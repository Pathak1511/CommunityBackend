const express = require('express');
const router = express.Router();
const roleController = require('./../controllers/roleController');
// get all and create method
router
  .route('/')
  .get(roleController.getAllrole)
  .post(roleController.createRole);

module.exports = router;
