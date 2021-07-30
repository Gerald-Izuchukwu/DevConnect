const Profile = require('../models/Profile');
const User = require('../models/Users');
const { validationResult } = require('express-validator');
const request = require('request');
const config = require('config');
const { response } = require('express');

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    ); //check here
    if (!profile) {
      return res.status(500).json({ msg: 'No profile with this user' });
    }

    res.status(200).json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const createProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // ie if there are errors
    return res.status(400).json({ errors: errors.array() });
  }
  const { id } = req.user;
  const {
    company,
    location,
    bio,
    status,
    githubusername,
    website,
    skills,
    youtube,
    twitter,
    instagram,
    linkedin,
    facebook,
  } = req.body;

  // build profile object
  const profileFields = {};
  profileFields.user = id;
  if (company) {
    profileFields.company = company;
  }
  if (website) profileFields.website = website;
  if (location) profileFields.location = location;
  if (bio) profileFields.bio = bio;
  if (status) profileFields.status = status;
  if (githubusername) profileFields.githubusername = githubusername;
  if (skills) {
    profileFields.skills = skills.split(',').map((skill) => skill.trim());
  }

  // build social object
  profileFields.social = {};

  if (youtube) profileFields.social.youtube = youtube;
  if (twitter) profileFields.social.twitter = twitter;
  if (linkedin) profileFields.social.linkedin = linkedin;
  if (facebook) profileFields.social.facebook = facebook;
  if (instagram) profileFields.social.instagram = instagram;

  // console.log(profileFields.social.twitter)

  try {
    let profile = await Profile.findOne({ user: id });
    if (profile) {
      // update Profile
      profile = await Profile.findOneAndUpdate(
        { user: id },
        { $set: profileFields },
        { new: true }
      );
      return res.json(profile);
    }

    // Create profile
    profile = new Profile(profileFields);
    await profile.save();
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Error');
  }
};

const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getProfileByID = async (req, res) => {
  const { user_id } = req.params;
  try {
    const profile = await Profile.findOne({ user: user_id }).populate('user', [
      'name',
      'avatar',
    ]);
    if (!profile) {
      return res.status(400).json({ msg: 'there is no profile for this user' });
    }
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'there is no profile for this user' });
    }
    res.status(500).send('Server Error');
  }
};

const deleteProfile = async (req, res) => {
  const { id } = req.user;
  try {
    // remove profile
    await Profile.findOneAndRemove({ user: id });
    // remove user
    await User.findOneAndRemove({ _id: id });
    res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const putProfileExperience = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { title, company, location, from, to, current, description } = req.body;

  const newExp = {
    title: title,
    company: company,
    location: location,
    from: from,
    to: to,
    current,
    description,
  };

  const { id } = req.user;

  try {
    const profile = await Profile.findOne({ user: id });
    profile.experience.unshift(newExp);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const deleteExperience = async (req, res) => {
  const { id } = req.user;
  try {
    const profile = await Profile.findOne({ user: id });

    // get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);
    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const putEducation = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const {
    school,
    degree,
    fieldOfStudy,
    location,
    from,
    to,
    current,
    description,
  } = req.body;

  const newEdu = {
    school,
    degree,
    fieldOfStudy: fieldOfStudy,
    location: location,
    from: from,
    to: to,
    current,
    description,
  };

  const { id } = req.user;

  try {
    const profile = await Profile.findOne({ user: id });
    profile.education.unshift(newEdu);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

const deleteEducation = async (req, res) => {
  const { id } = req.user;
  try {
    const profile = await Profile.findOne({ user: id });

    // get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
};

const getGitHubRepo = async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&
              sort=created:asc&client_id=${config.get('gitHubClientID')}
              &client_secret=${config.get('gitHubSecret')}`,
      method: 'GET',
      headers: {
        'user-agent': 'node.js',
      },
    };
    request(options, (error, response, body) => {
      if (error) {
        console.error(error);
      }
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: 'No Git Hub Profile Found' });
      }
      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {
  getProfile,
  createProfile,
  getProfiles,
  getProfileByID,
  deleteProfile,
  putProfileExperience,
  deleteExperience,
  putEducation,
  deleteEducation,
  getGitHubRepo,
};
