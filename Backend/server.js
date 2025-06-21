const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your_jwt_secret_key';


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});

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



app.post('/api/signup', async (req, res) => {
  const { email, password, userType } = req.body;

  try {
    const db = getDB();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 = salt rounds

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


app.post('/api/signin', async (req, res) => {
  console.log('Signin route hit');
  const { email, password, userType } = req.body;

  try {
    const db = getDB();

    const user = await db.collection('users').findOne({ email, userType });

    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('user._id:', user._id);
    console.log('typeof user._id:', typeof user._id);


    res.status(200).json({
    message: 'Login successful',
    userId: user._id.toString(),
    userType: user.userType,
    });

  } catch (err) {
    console.error('Signin error:', err);
    res.status(500).json({ message: 'Signin failed' });
  }
});