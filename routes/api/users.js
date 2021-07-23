const express = require('express');
const router = express.Router();
const { check, validationResult} = require('express-validator')
// const User = require('../../models/Users')
// const gravatar = require('gravatar')
// const bcrypt = require('bcryptjs')
// const jwt = require('jsonwebtoken')
// const config = require('config')
const registerUser = require('../../controllers/users')

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post('/', [
    check('name', 'Name is required').not().isEmpty(), //checks if the name field is empty
    check('email', 'Please include a valid email').isEmail(), //checks if thee email field is a valid email address
    check('password', 'please enter a password with 6 or more characters').isLength({ min: 6 }) // checks the legnth of the password
], registerUser );

module.exports = router