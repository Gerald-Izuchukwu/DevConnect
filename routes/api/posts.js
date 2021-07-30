const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
// const Profile = require('../../models/Profile');
const postsController = require('../../controllers/posts');

// @route    POST api/posts
// @desc     Create a post
// @access   Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  postsController.createPost
);

// @route    GET api/posts
// @desc     Get all posts
// @access   Private
router.get('/', auth, postsController.getAllPosts);

// @route    GET api/posts/:id
// @desc     Get post by id
// @access   Private
router.get('/:id', auth, postsController.getPostByID);

// @route    DELETE api/posts/:id
// @desc     Delete post by id
// @access   Private

router.delete('/:id', auth, postsController.deletePostByID);

// @route    PUT api/posts/like/:id
// @desc     Like a post
// @access   Private
router.put('/like/:id', auth, postsController.likePost);

// @route    PUT api/posts/unlike/:id
// @desc     unLike a post
// @access   Private
router.put('/unlike/:id', auth, postsController.unlikePost);

// @route    POST api/posts/comment/:id
// @desc     comment on a post
// @access   Private
router.post(
  '/comment/:id',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  postsController.addComment
);

// @route    DELETE api/posts/comment/:id/:comment_id
// @desc     Delete a comment
// @access   Private

router.delete('/comment/:id/:comment_id', auth, postsController.deleteComment);
module.exports = router;
