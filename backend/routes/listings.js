const express = require('express');
const { Listing } = require('../db');
const { requireAuth } = require('./auth');

const router = express.Router();
const VALID_CATEGORIES = ['Adventure', 'Cultural', 'Food & Drink', 'Water Activities', 'Wildlife', 'Wellness', 'Art & History', 'Nightlife'];

// GET /api/listings/my/listings — must be before /:id
router.get('/my/listings', requireAuth, async (req, res) => {
  try {
    const listings = await Listing.find({ user_id: req.userId })
      .populate('user_id', 'name avatar_seed')
      .sort({ createdAt: -1 });

    const result = listings.map(l => formatListing(l));
    res.json({ listings: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch your listings.' });
  }
});

// GET /api/listings — public feed
router.get('/', async (req, res) => {
  try {
    const { category, country, search, limit = 20, offset = 0 } = req.query;

    const query = { is_published: true };

    if (category) query.category = category;
    if (country) query.country = { $regex: country, $options: 'i' };
    if (search) {
      query.$or = [
        { title:       { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location:    { $regex: search, $options: 'i' } },
        { country:     { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Listing.countDocuments(query);
    const listings = await Listing.find(query)
      .populate('user_id', 'name avatar_seed')
      .sort({ createdAt: -1 })
      .skip(parseInt(offset))
      .limit(parseInt(limit));

    res.json({
      listings: listings.map(l => formatListing(l)),
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch listings.' });
  }
});

// GET /api/listings/:id
router.get('/:id', async (req, res) => {
  try {
    const listing = await Listing.findOne({ _id: req.params.id, is_published: true })
      .populate('user_id', 'name avatar_seed createdAt');
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    res.json({ listing: formatListing(listing) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch listing.' });
  }
});

// POST /api/listings
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, location, country, category, duration_hours, price_usd, max_guests, tags } = req.body;

    if (!title || !description || !location || !country || !category || !duration_hours || !price_usd)
      return res.status(400).json({ error: 'All required fields must be provided.' });
    if (!VALID_CATEGORIES.includes(category))
      return res.status(400).json({ error: 'Invalid category.' });
    if (title.length < 5 || title.length > 100)
      return res.status(400).json({ error: 'Title must be between 5 and 100 characters.' });
    if (description.length < 20)
      return res.status(400).json({ error: 'Description must be at least 20 characters.' });

    const listing = await Listing.create({
      user_id: req.userId,
      title: title.trim(),
      description: description.trim(),
      location: location.trim(),
      country: country.trim(),
      category,
      duration_hours: parseFloat(duration_hours),
      price_usd: parseFloat(price_usd),
      max_guests: parseInt(max_guests) || 10,
      tags: Array.isArray(tags) ? tags.slice(0, 8) : [],
    });

    await listing.populate('user_id', 'name avatar_seed');
    res.status(201).json({ listing: formatListing(listing) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create listing.' });
  }
});

// PUT /api/listings/:id
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    if (listing.user_id.toString() !== req.userId.toString())
      return res.status(403).json({ error: 'You can only edit your own listings.' });

    const { title, description, location, country, category, duration_hours, price_usd, max_guests, tags } = req.body;

    if (title)         listing.title         = title.trim();
    if (description)   listing.description   = description.trim();
    if (location)      listing.location      = location.trim();
    if (country)       listing.country       = country.trim();
    if (category)      listing.category      = category;
    if (duration_hours) listing.duration_hours = parseFloat(duration_hours);
    if (price_usd)     listing.price_usd     = parseFloat(price_usd);
    if (max_guests)    listing.max_guests    = parseInt(max_guests);
    if (tags)          listing.tags          = Array.isArray(tags) ? tags.slice(0, 8) : listing.tags;

    await listing.save();
    await listing.populate('user_id', 'name avatar_seed');
    res.json({ listing: formatListing(listing) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update listing.' });
  }
});

// DELETE /api/listings/:id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found.' });
    if (listing.user_id.toString() !== req.userId.toString())
      return res.status(403).json({ error: 'You can only delete your own listings.' });

    await listing.deleteOne();
    res.json({ message: 'Listing deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete listing.' });
  }
});

// Format listing for response
function formatListing(l) {
  return {
    id: l._id,
    user_id: l.user_id._id || l.user_id,
    title: l.title,
    description: l.description,
    location: l.location,
    country: l.country,
    category: l.category,
    duration_hours: l.duration_hours,
    price_usd: l.price_usd,
    max_guests: l.max_guests,
    tags: l.tags,
    is_published: l.is_published,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
    host_name: l.user_id.name || null,
    host_avatar: l.user_id.avatar_seed || null,
  };
}

module.exports = router;