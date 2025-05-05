require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded images

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/finesse';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ MODELS
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  phone: String,
  profilePicture: { type: String, default: null },
  created_at: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  detailedDescription: String,
  price: Number,
  oldPrice: Number,
  discount: String,
  category: String,
  imageUrl: String,
  sizes: [String],
  colors: [String]
});
const Product = mongoose.model('Product', productSchema);

const categorySchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  price: Number,
  oldPrice: Number,
  discount: String,
  stock: Number
});
const Category = mongoose.model('Category', categorySchema);

const reviewSchema = new mongoose.Schema({
  name: String,
  content: String
});
const Review = mongoose.model('Review', reviewSchema);

const cartSchema = new mongoose.Schema({
  userId: String,
  items: [
    {
      productId: String,
      title: String,
      price: Number,
      imageUrl: String,
      size: String,
      quantity: { type: Number, default: 1 }
    }
  ]
});
const Cart = mongoose.model('Cart', cartSchema);

// ✅ AUTH ROUTES
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

// ✅ PRODUCT ROUTES
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CATEGORY + REVIEW ROUTES
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ CART ROUTES
app.get('/api/cart/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });
    res.json(cart.items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/cart/add', async (req, res) => {
  const { userId, productId, title, price, imageUrl, size } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.productId === productId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, title, price, imageUrl, size, quantity: 1 });
    }

    await cart.save();
    res.status(201).json({ message: 'Item added to cart' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ PROFILE PICTURE UPLOAD (OPTIONAL)
const upload = multer({ dest: 'uploads/' });
app.post('/api/user/profile-picture', upload.single('image'), async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ error: 'User ID is required' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (req.file) {
      const imagePath = `/uploads/${req.file.filename}`;
      user.profilePicture = imagePath;
    } else {
      user.profilePicture = null;
    }

    await user.save();
    res.json({ message: '✅ Profile picture updated', user });
  } catch (err) {
    res.status(500).json({ error: '❌ Server error' });
  }
});

// ✅ SERVER START
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
