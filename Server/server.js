const express = require('express');
const cors = require('cors');
const { connectDB, getDB } = require('./db');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

connectDB().then(() => {
  // ✅ Root route
  app.get('/', (req, res) => {
    res.send('Server is up and running!');
  });

  // ✅ Check if email exists
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

  // ✅ Signup
  app.post('/api/signup', async (req, res) => {
  const { name, email, password, userType } = req.body;
  console.log(req.body)

  if (!name || !email || !password || !userType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const db = getDB();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.collection('users').insertOne({
      name,
      email,
      password: hashedPassword,
      userType,
    });

    res.status(201).json({ message: 'Signup successful', userId: result.insertedId });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});


  // ✅ Signin
  app.post('/api/signin', async (req, res) => {
    const { email, password, userType } = req.body;
    try {
      const db = getDB();
      const user = await db.collection('users').findOne({ email, userType });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
      console.log('Logged in user:', user);

      res.status(200).json({
        message: 'Login successful',
        userId: user._id.toString(),
        userType: user.userType,
        name: user.name
      });
      console.log(user.name)
    } catch (err) {
      console.error('Signin error:', err);
      res.status(500).json({ message: 'Signin failed' });
    }
  });

  // ✅ Create delivery request
  app.post('/api/delivery-requests', async (req, res) => {
    const {
      pickupAddress,
      dropoffAddress,
      packageNote,
      customerId,
      packageWeight,
      distance,
    } = req.body;

    if (
      !pickupAddress || !dropoffAddress || !packageNote || !customerId ||
      isNaN(parseFloat(packageWeight)) || isNaN(parseFloat(distance))
    ) {
      return res.status(400).json({ message: 'All fields are required and must be valid numbers' });
    }

    try {
      const db = getDB();
      const customer = await db.collection('users').findOne({
        _id: new ObjectId(customerId),
        userType: 'customer',
      });

      if (!customer) return res.status(403).json({ message: 'Invalid customer ID' });

      const payload = {
        customerId,
        pickupAddress,
        dropoffAddress,
        note: packageNote,
        packageWeight: parseFloat(packageWeight),
        distance: parseFloat(distance),
        status: 'Pending',
        createdAt: new Date(),
      };

      const result = await db.collection('deliveryRequests').insertOne(payload);
      res.status(201).json({ message: 'Delivery request created', requestId: result.insertedId });
    } catch (error) {
      console.error('Delivery request error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // ✅ Fetch pending delivery requests
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

  // ✅ Driver dashboard
  app.get('/api/driver-dashboard/:id', async (req, res) => {
    const driverId = req.params.id;
    const db = getDB();

    try {
      const allRequests = await db.collection('deliveryRequests').find({
        $or: [
          { status: 'Pending' },
          { status: 'Accepted', driverId },
          { status: 'Ongoing', driverId },
          { status: 'Completed', driverId },
        ],
      }).sort({ createdAt: -1 }).toArray();

      const pending = allRequests.filter(r => r.status === 'Pending');
      const accepted = allRequests.filter(r => r.status === 'Accepted' && r.driverId === driverId);
      const ongoing = allRequests.filter(r => r.status === 'Ongoing' && r.driverId === driverId);
      const completed = allRequests.filter(r => r.status === 'Completed' && r.driverId === driverId);

      res.json({ pending, accepted, ongoing, completed });
    } catch (err) {
      console.error('Driver dashboard error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // ✅ Update delivery status
  app.put('/api/delivery-requests/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status, driverId } = req.body;
    const db = getDB();
    const deliveryId = new ObjectId(id);

    if (!['Accepted', 'Ongoing', 'Completed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    try {
      const request = await db.collection('deliveryRequests').findOne({ _id: deliveryId });
      if (!request) return res.status(404).json({ message: 'Delivery not found' });

      await db.collection('deliveryRequests').updateOne(
        { _id: deliveryId },
        { $set: { status, driverId } }
      );

      res.status(200).json({ message: `Status updated to ${status}` });
    } catch (err) {
      console.error('Status update error:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

  // ✅ Customer delivery history
  // ✅ Customer delivery history
app.get('/api/customers/:id/history', async (req, res) => {
  const { id } = req.params;
  const db = getDB();

  try {
    const history = await db.collection('deliveryRequests')
      .find({ customerId: id })
      .sort({ createdAt: -1 })
      .toArray();

    const enrichedHistory = await Promise.all(history.map(async (item) => {
      const customer = await db.collection('users').findOne({ _id: new ObjectId(item.customerId) });
      const customerName = customer ? customer.name || customer.email : 'Unknown Customer';

      let driverName = 'Not Assigned';
      if (item.driverId) {
        const driver = await db.collection('users').findOne({ _id: new ObjectId(item.driverId) });
        driverName = driver ? driver.name || driver.email : 'Not Assigned';
      }

      return {
        ...item,
        customerName,
        driverName,
      };
    }));

    res.json(enrichedHistory);
  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Failed to fetch delivery history.' });
  }
});

});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
