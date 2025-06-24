const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb'); // ✅ Import ObjectId

const app = express();
const PORT = 5000;
const SECRET_KEY = 'your_secret_key'; // ✅ Replace with env var in real apps

app.use(cors());
app.use(express.json());

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

// ✅ JWT middleware (currently unused but correct)
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// ✅ Check email for duplicates
app.get('/api/check-email', async (req, res) => {
  const { email } = req.query;
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ email });
    res.json({ exists: !!user });
  } catch (err) {
    console.error('Email check error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Signup route
app.post('/api/signup', async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const db = getDB();
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      email,
      password: hashedPassword,
      userType,
    });

    res.status(200).json({ message: 'User registered successfully', userId: result.insertedId });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

// ✅ Signin route
app.post('/api/signin', async (req, res) => {
  const { email, password, userType } = req.body;
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ email, userType });

    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    // Optional: create token
    // const token = jwt.sign({ userId: user._id, userType: user.userType }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Login successful',
      userId: user._id.toString(),
      userType: user.userType,
      // token,
    });
  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Signin failed' });
  }
});

// ✅ Create delivery request (only by customers)
app.post('/api/delivery-requests', async (req, res) => {
  console.log('Received delivery request body:', req.body);
  const { pickupAddress, dropoffAddress, packageNote, customerId } = req.body;

  if (!pickupAddress || !dropoffAddress || !packageNote || !customerId) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDB();
    const customer = await db.collection('users').findOne({
      _id: new ObjectId(customerId),
      userType: 'customer',
    });

    if (!customer) {
      return res.status(403).json({ message: 'Invalid customer ID' });
    }

    const result = await db.collection('deliveryRequests').insertOne({
      customerId,
      pickupAddress,
      dropoffAddress,
      note: packageNote,
      status: 'Pending',
      createdAt: new Date(),
    });

    res.status(201).json({ message: 'Delivery request created', requestId: result.insertedId });
  } catch (error) {
    console.error('Delivery request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ Get all pending delivery requests (for listing)
app.get('/api/delivery-requests', async (req, res) => {
  try {
    const db = getDB();
    const requests = await db
      .collection('deliveryRequests')
      .find({ status: 'Pending' })
      .sort({ createdAt: -1 })
      .toArray();

    res.status(200).json(requests);
  } catch (error) {
    console.error('Fetching requests failed:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
