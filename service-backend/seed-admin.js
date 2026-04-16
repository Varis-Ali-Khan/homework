require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const ADMIN_PHONE    = '9900292323';   // change this
const ADMIN_NAME     = 'admin';   // change this
const ADMIN_PASSWORD = 'admin123';      // change this

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('MongoDB Connected ✅');

  // Inline schema so this script has no import issues
  const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
    name:     { type: String, required: true },
    phone:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['customer', 'provider', 'admin'], default: 'customer' },
  }, { timestamps: true }));

  const existing = await User.findOne({ phone: ADMIN_PHONE });
  if (existing) {
    // If user already exists, just promote to admin
    existing.role = 'admin';
    await existing.save();
    console.log(`✅ Existing user "${existing.name}" promoted to admin.`);
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await User.create({ name: ADMIN_NAME, phone: ADMIN_PHONE, password: hashed, role: 'admin' });
    console.log(`✅ Admin user created!`);
    console.log(`   Phone:    ${ADMIN_PHONE}`);
    console.log(`   Password: ${ADMIN_PASSWORD}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
