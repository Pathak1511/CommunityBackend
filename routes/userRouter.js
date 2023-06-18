const express = require('express');
const router = express.Router();
const authRouter = require('./../controllers/authController');

// Sign up
router.route('/signup').post(authRouter.signup);
// Sign in
router.route('/signin').post(authRouter.signin);
// Get me
router.route('/me').get(authRouter.getMe);

module.exports = router;
