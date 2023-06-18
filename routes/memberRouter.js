const express = require('express');
const router = express.Router();
const memberController = require('./../controllers/memberController');
const userAuth = require('./../controllers/authController');
// Add member
router.route('/').post(userAuth.protect, memberController.addMember);
// Remove member
router.route('/:id').delete(userAuth.protect, memberController.deleteMember);

module.exports = router;
