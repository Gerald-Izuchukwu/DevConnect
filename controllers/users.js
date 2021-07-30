const { validationResult } = require('express-validator');
const User = require('../models/Users');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// @route    POST api/users
// @desc     Register user
// @access   Public
const registerUser = async (req, res) => {
  // console.log(req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
    //if there isn an error, return the error array
  }

  const { name, email, password } = req.body; //destructuring from req.body

  try {
    // check if user exists
    let user = await User.findOne({ email });
    //.findOne is a mongoose method and you can pass in any of the object from the User Schema

    if (user) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'User with this email already exists' }] });
    }
    // get user's gravatar
    const avatar = gravatar.url(email, { s: '200', r: 'pg', d: 'mm' });

    user = new User({
      name,
      email,
      avatar,
      password,
      // creating an instance of the user
    });

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save(); //saves the user

    // res.send("User Registered")

    // implementing jwt
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      config.get('jwtToken'),
      { expiresIn: 360000 },
      (err, token) => {
        if (err) {
          throw err;
        }
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = registerUser;
