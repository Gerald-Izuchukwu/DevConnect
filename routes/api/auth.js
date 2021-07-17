const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth')
const User = require('../../models/Users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult} = require('express-validator')

// @route    GET api/auth
// @desc     Register user
// @access   Private
router.get('/', auth, async (req, res)=> {
    try {
        const user = await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }
});

// @route    POST api/auth
// @desc     Login A  user
// @access   Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(), //checks if thee email field is a valid email address
    check('password', 'password is required').exists() // checks the legnth of the password
], async(req, res)=>{
    // console.log(req.body);
    const errors = validationResult(req)
    if(!errors.isEmpty()){ 
        return res.status(400).json({errors : errors.array()})
        //if there isn an error, return the error array
    }

    const {  email, password} = req.body; //destructuring from req.body

    try {
        // check if user exists
        let user = await User.findOne({email}) 
        //.findOne is a mongoose method and you can pass in any of the object from the User Schema

        if(!user){
            return res.status(400).json({errors : [{msg : 'Invalid Crdentials'}]})
        }


        const isMatched = await bcrypt.compare(password, user.password)

        if(!isMatched){
            return res.status(400).json({errors : [{msg : 'Invalid Crdentials'}]})
        }

        
        // implemeting jwt
        const payload = {
            user:{
                id: user.id
            }
        }

        jwt.sign(payload, config.get('jwtToken'), {expiresIn : 360000}, (err, token)=>{
            if(err){
                throw err
            }
            res.json({token})
        })


    } catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
        
    }


});

module.exports = router