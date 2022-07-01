const express = require('express');
const SignUpController = require('../controller/signUpController');
const router = express.Router();

router.post('/', SignUpController.signup);

module.exports = router;