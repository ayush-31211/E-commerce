const express = require('express');
const { registerUser, loginUser, logoutUser, forgotPassword } = require('../controllers/authController');
// const isAuthenticatedUser = require('../middleware/auth');
const router = express.Router();

router.route('/registerUser').post(registerUser);
router.route('/login').post(loginUser);


router.route('/password/forgot').post(forgotPassword);
router.route('/password/reset/:token').put(forgotPassword);


router.route('/logout').get(logoutUser);



module.exports = router;