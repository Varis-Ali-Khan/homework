const express = require('express');
const router = express.Router();
const { getProviders, setupProfile, getMyProfile } = require('../controllers/providerController');
const auth = require('../middleware/auth');

router.get('/', getProviders);               // Public — list completed profiles
router.post('/profile', auth, setupProfile); // Protected — provider fills details
router.get('/me', auth, getMyProfile);       // Protected — get own profile

module.exports = router;