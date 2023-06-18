const express = require('express');
const router = express.Router();
const communityController = require('./../controllers/communityController');

// get and create routes
router
  .route('/')
  .get(communityController.getAllCommunity)
  .post(communityController.createCommunity);
// get all members of community
router.route('/:id/members').get(communityController.getAllMember);
// // Get community owned by me
router
  .route('/me/owner')
  .get(communityController.getUserId, communityController.getMyOwnedCommunity);
// Get my joined Community
router
  .route('/me/member')
  .get(communityController.getUserId, communityController.getJoinedCommunity);

module.exports = router;
