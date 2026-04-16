const User = require('../models/User');
const Provider = require('../models/Provider');

// GET /admin/stats
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalProviders = await User.countDocuments({ role: 'provider' });
    const subscribedProviders = await Provider.countDocuments({ isSubscribed: true });
    res.json({ totalUsers, totalCustomers, totalProviders, subscribedProviders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: 'admin' } })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /admin/users/:id
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await Provider.deleteOne({ user: id });
    await User.findByIdAndDelete(id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /admin/providers
const getProviders = async (req, res) => {
  try {
    const providers = await Provider.find()
      .populate('user', 'name phone')
      .sort({ createdAt: -1 });
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PATCH /admin/providers/:id/subscription
const toggleSubscription = async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    provider.isSubscribed = !provider.isSubscribed;
    await provider.save();
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE /admin/providers/:id
const deleteProvider = async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    if (!provider) return res.status(404).json({ message: 'Provider not found' });
    res.json({ message: 'Provider deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getUsers, deleteUser, getProviders, toggleSubscription, deleteProvider };
