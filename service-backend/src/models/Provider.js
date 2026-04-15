const mongoose = require("mongoose");

const providerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: String,
    phone: String,
    service: String,
    area: String,
    experience: Number,
    isProfileComplete: { type: Boolean, default: false },
    isSubscribed: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Provider", providerSchema);