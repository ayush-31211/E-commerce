const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword, resetPassword, updateProfile } = require('../controllers/authController');
const { isAuthenticatedUser } = require('../middleware/auth');
// const isAuthenticatedUser = require('../middleware/auth');
const router = express.Router();

router.route('/registerUser').post(registerUser);
router.route('/login').post(loginUser);


router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(resetPassword);


router.route('/update/me').put(isAuthenticatedUser,updateProfile);


router.route('/logout').get(logoutUser);



module.exports = router;