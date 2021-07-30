const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check } = require('express-validator');
const profileController = require('../../controllers/profile');

// @route    GET api/profile/me
// @desc     Get user's profile
// @access   Private
router.get('/me', auth, profileController.getProfile);

// @route    POST api/profile
// @desc     Create or update a user profile
// @access   Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  profileController.createProfile
);

// @route    GET api/profile/
// @desc     Get all profile
// @access   Public
router.get('/', profileController.getProfiles);

// @route    GET api/profile/user/:user_id
// @desc     Get profile by user id
// @access   Public
router.get('/user/:user_id', profileController.getProfileByID);

// @route    DELETE api/profile/
// @desc     Delete profile, user and posts
// @access   Private
router.delete('/', auth, profileController.deleteProfile);

// @route    PUT api/profile/experience
// @desc     Add profile experience
// @access   Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'Company is required ').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],

  profileController.putProfileExperience
);

// @route    DELETE api/profile/experience/:exp_id
// @desc     delete an experince from profile
// @access   Private
router.delete('/experience/:exp_id', auth, profileController.deleteExperience);

// @route    PUT api/profile/education
// @desc     Add profile education
// @access   Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School  is required').not().isEmpty(),
      check('degree', 'degree is required ').not().isEmpty(),
      check('fieldOfStudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From Date is required').not().isEmpty(),
    ],
  ],
  profileController.putEducation
);

// @route    DELETE api/profile/education/:edu_id
// @desc     delete an experince from profile
// @access   Private
router.delete('/education/:edu_id', auth, profileController.deleteEducation);

// @route    GET api/profile/github/:username
// @desc     Get USers repos from GitHub
// @access   Public
router.get('/github/:username', profileController.getGitHubRepo);

module.exports = router;
