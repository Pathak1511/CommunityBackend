const express = require('express');
const router = express.Router();
const memberController = require('./../controllers/memberController');
// Add member
router.route('/').post(memberController.addMember);
// Remove member
router.route('/:id').delete(memberController.deleteMember);

module.exports = router;
