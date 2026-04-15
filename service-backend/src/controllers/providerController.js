const Provider = require('../models/Provider');

// GET /providers — only returns providers who completed their profile
const getProviders = async (req, res) => {
  try {
    const { service } = req.query;
    const filter = { isProfileComplete: true };
    if (service) {
      filter.service = { $regex: service, $options: 'i' };
    }

    const providers = await Provider.find(filter).select('-user');
    res.json(providers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /providers/profile — provider fills in their service details (protected)
const setupProfile = async (req, res) => {
  try {
    const { service, area, experience } = req.body;

    if (!service || !area || !experience) {
      return res.status(400).json({ message: 'Service, area and experience are required' });
    }

    const provider = await Provider.findOneAndUpdate(
      { user: req.user.id },
      { service, area, experience: Number(experience), isProfileComplete: true },
      { new: true }
    );

    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }

    res.json({ message: 'Profile setup complete', provider });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /providers/me — get own profile (protected)
const getMyProfile = async (req, res) => {
  try {
    const provider = await Provider.findOne({ user: req.user.id });
    if (!provider) {
      return res.status(404).json({ message: 'Provider profile not found' });
    }
    res.json(provider);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProviders, setupProfile, getMyProfile };
