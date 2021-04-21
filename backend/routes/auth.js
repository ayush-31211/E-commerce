const express = require('express');
const { registerUser, loginUser, logoutUser } = require('../controllers/authController');
const router = express.Router();

router.route('/registerUser').post(registerUser);
router.route('/login').get(loginUser);
router.route('/logout').get(logoutUser);



module.exports = router;