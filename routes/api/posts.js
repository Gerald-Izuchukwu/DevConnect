const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const {check, validationResult} = require('express-validator');
const User = require('../../models/Users');
const Profile = require('../../models/Profile');
const Posts = require('../../models/Posts');


// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]], async(req, res)=> {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()})
    }
    


    try {
        const  { id } = req.user
        const user = await User.findById(id).select('-password')

        const newPost = new Posts({
            text : req.body.text,
            name : user.name,
            avatar : user.avatar,
            user : id
        })

        const post = await newPost.save()

        res.json(post)
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
        
    }

});


module.exports = router