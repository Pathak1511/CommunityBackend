const express = require('express');
const router = express.Router();
const communityController = require('./../controllers/communityController');
const userAuth = require('./../controllers/authController');
// get and create routes
router
  .route('/')
  .get(communityController.getAllCommunity)
  .post(communityController.getUserId, communityController.createCommunity);
// get all members of community
router
  .route('/:id/members')
  .get(userAuth.protect, communityController.getAllMember);
// // Get community owned by me
router
  .route('/me/owner')
  .get(
    userAuth.protect,
    communityController.getUserId,
    communityController.getMyOwnedCommunity
  );
// Get my joined Community
router
  .route('/me/member')
  .get(
    userAuth.protect,
    communityController.getUserId,
    communityController.getJoinedCommunity
  );

module.exports = router;
