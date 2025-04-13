require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finesse';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

/* ============================================
   ✅ USER MODEL
============================================ */
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

/* ============================================
   ✅ PRODUCT MODEL
============================================ */
const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  oldPrice: Number,
  discount: String,
  category: String,
  imageUrl: String
});
const Product = mongoose.model('Product', productSchema);

/* ============================================
   ✅ CATEGORY MODEL
============================================ */
const categorySchema = new mongoose.Schema({
  name: String,
  imageUrl: String
});
const Category = mongoose.model('Category', categorySchema);

/* ============================================
   ✅ REVIEW MODEL
============================================ */
const reviewSchema = new mongoose.Schema({
  name: String,
  content: String
});
const Review = mongoose.model('Review', reviewSchema);

/* ============================================
   ✅ AUTH ROUTES
============================================ */

// Signup Route
app.post('/api/signup', async (req, res) => {
  const { name, email, password, phone } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already exists' });

    const newUser = new User({ name, email, password, phone });
    const saved = await newUser.save();
    res.status(201).json({ message: 'Signup successful', user: saved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   ✅ FETCH ROUTES
============================================ */

// Fetch All Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch All Categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch All Reviews
app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ============================================
   ✅ START SERVER
============================================ */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
