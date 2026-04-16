const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getStats,
  getUsers,
  deleteUser,
  getProviders,
  toggleSubscription,
  deleteProvider,
} = require('../controllers/adminController');

router.use(adminAuth);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);
router.get('/providers', getProviders);
router.patch('/providers/:id/subscription', toggleSubscription);
router.delete('/providers/:id', deleteProvider);

module.exports = router;
