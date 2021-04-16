const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');
const router = express.Router();

router.route('/registerUser').post(registerUser);
router.route('/login').get(loginUser);



module.exports = router;