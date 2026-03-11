const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password_hash: { type: String, required: true },
  avatar_seed: { type: String },
}, { timestamps: true });

// Listing Schema
const listingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
  category: { type: String, required: true },
  duration_hours: { type: Number, required: true },
  price_usd: { type: Number, required: true },
  max_guests: { type: Number, default: 10 },
  tags: { type: [String], default: [] },
  is_published: { type: Boolean, default: true },
}, { timestamps: true });

// Indexes
listingSchema.index({ category: 1 });
listingSchema.index({ country: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ title: 'text', description: 'text', location: 'text', country: 'text' });

const User = mongoose.model('User', userSchema);
const Listing = mongoose.model('Listing', listingSchema);

async function initDb() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB Atlas');
  await seedData();
}

async function seedData() {
  const count = await Listing.countDocuments();
  if (count > 0) return;

  const hash = bcrypt.hashSync('demo1234', 10);

  const users = await User.insertMany([
    { name: 'Sofia Reyes',   email: 'sofia@demo.com',  password_hash: hash, avatar_seed: 'sofia'  },
    { name: 'Marco Bianchi', email: 'marco@demo.com',  password_hash: hash, avatar_seed: 'marco'  },
    { name: 'Amara Diallo',  email: 'amara@demo.com',  password_hash: hash, avatar_seed: 'amara'  },
  ]);

  await Listing.insertMany([
    { user_id: users[0]._id, title: 'Sunrise Hike to Mount Batur Volcano', description: 'Watch the sunrise from the top of an active volcano with a local guide. We trek through lava fields and cook breakfast using volcanic steam.', location: 'Kintamani', country: 'Indonesia', category: 'Adventure', duration_hours: 7, price_usd: 45, max_guests: 8, tags: ['hiking','volcano','sunrise','bali'] },
    { user_id: users[0]._id, title: 'Traditional Balinese Cooking Class', description: 'Learn to cook 5 authentic Balinese dishes from scratch starting at the local market, then cook in a traditional open-air kitchen.', location: 'Ubud', country: 'Indonesia', category: 'Food & Drink', duration_hours: 4, price_usd: 35, max_guests: 6, tags: ['cooking','food','culture','bali'] },
    { user_id: users[1]._id, title: 'Venice Hidden Canals by Kayak', description: 'Paddle through Venice secret canals that gondolas cannot reach. Your guide reveals centuries of hidden history and local haunts unknown to most tourists.', location: 'Venice', country: 'Italy', category: 'Water Activities', duration_hours: 3, price_usd: 65, max_guests: 4, tags: ['kayak','venice','italy','canals'] },
    { user_id: users[1]._id, title: 'Truffle Hunting in Tuscany', description: 'Join a local truffle hunter and his dog on a morning search through ancient oak forests. Learn to harvest and cook with fresh truffles.', location: 'San Miniato', country: 'Italy', category: 'Food & Drink', duration_hours: 5, price_usd: 120, max_guests: 6, tags: ['truffle','tuscany','food','italy'] },
    { user_id: users[2]._id, title: 'Desert Stargazing with a Bedouin Guide', description: 'Spend an evening in the Sahara with a Bedouin guide who navigates by stars. Learn ancient astronomical knowledge around a fire.', location: 'Merzouga', country: 'Morocco', category: 'Cultural', duration_hours: 10, price_usd: 80, max_guests: 10, tags: ['desert','stargazing','morocco','bedouin'] },
    { user_id: users[2]._id, title: 'Medina Street Food Walking Tour', description: 'Navigate Marrakech ancient medina with a local foodie guide. Sample 12 street foods at stalls that have fed families for generations.', location: 'Marrakech', country: 'Morocco', category: 'Food & Drink', duration_hours: 3, price_usd: 40, max_guests: 8, tags: ['food','marrakech','morocco','walking'] },
    { user_id: users[0]._id, title: 'Photography Walk Through Old Havana', description: 'Join a professional photographer for a golden-hour walk through Havana UNESCO-protected old city. Learn composition while capturing the city soul.', location: 'Havana', country: 'Cuba', category: 'Cultural', duration_hours: 3, price_usd: 55, max_guests: 5, tags: ['photography','cuba','havana','art'] },
    { user_id: users[1]._id, title: 'Amalfi Coast Sailing Sunset', description: 'Sail along the dramatic Amalfi Coast aboard a classic wooden boat. Swim in hidden sea caves and watch the sun sink with a glass of local wine.', location: 'Positano', country: 'Italy', category: 'Water Activities', duration_hours: 4, price_usd: 95, max_guests: 8, tags: ['sailing','amalfi','italy','sunset'] },
  ]);

  console.log('Database seeded with sample data');
}

module.exports = { initDb, User, Listing };