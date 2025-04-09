const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const path = require('path');
const bcrypt = require('bcrypt');
const User = require('./models/users');
const Booking = require('./models/Booking');
const Car = require('./models/Car');


const app = express();
const PORT = 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/car_rental', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

// Middleware
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
app.use(express.static("public")); 

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false
}));

// Static files
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'JS')));

// Serve index.html
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// Register Route
app.post('/register', async (req, res) => {
  const {
    fullName,
    email,
    password,
    phone
  } = req.body;
  try {
    if (!fullName || !email || !password || !phone) {
      return res.status(400).send("All fields are required.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      phone
    });
    await user.save();

    req.session.user = user;

    const fullNames = req.body.fullName || user.fullName || "";
    const names = fullNames.trim().split(" ");

    let initials = "";
    if (names.length >= 2) {
      initials = names[0][0] + names[1][0];
    } else if (names.length === 1) {
      initials = names[0][0];
    }
    initials = initials.toUpperCase();


    res.json({
      initials
    });
  } catch (err) {
    console.error("Error registering user:", err);
    return res.status(500).send("Registration failed.");
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const {
    email,
    password
  } = req.body;
  try {
    console.log("Login request:", req.body);
    const user = await User.findOne({
      email
    });
    console.log("User found:", user);
    if (!user) return res.status(401).send('Invalid email or password');

    const match = await bcrypt.compare(password, user.password);
    console.log("Password match:", match);
    if (!match) return res.status(401).send('Invalid email or password');

    req.session.user = user;

    return res.status(200).json({
      message: "Login successful",
      fullName: user.fullName,
      email: user.email
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).send("Login failed.");
  }
});


// Get Logged-in User
app.get('/get-user', (req, res) => {
  if (req.session.user) {
    const fullNames = req.body.fullName || user.fullName || "";
    const names = fullNames.trim().split(" ");

    let initials = "";
    if (names.length >= 2) {
      initials = names[0][0] + names[1][0];
    } else if (names.length === 1) {
      initials = names[0][0];
    }
    initials = initials.toUpperCase();
    return res.json({
      initials
    });
  } else {
    return res.json({
      initials: null
    });
  }
});
app.post('/book', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: 'Login required to book a ride.' });
  }

  const {
    pickupPoint,
    returnPoint,
    pickupDate,
    returnDate,
    pickupHour,
    pickupMin,
    pickupAmPm,
    returnHour,
    returnMin,
    returnAmPm,
  } = req.body;

  // ✅ Build times first
  const pickupTime = `${pickupHour}:${pickupMin} ${pickupAmPm}`;
  const returnTime = `${returnHour}:${returnMin} ${returnAmPm}`;

  // ✅ Then validate everything
  if (!pickupPoint || !returnPoint || !pickupDate || !returnDate || !pickupTime || !returnTime) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    // Prevent double bookings
    const existing = await Booking.findOne({
      pickupDate,
      pickupTime,
      userId: req.session.user._id,
    });

    if (existing) {
      return res.status(400).json({ message: 'You already booked a ride at this time.' });
    }

    // Save booking
    const booking = new Booking({
      userId: req.session.user._id,
      pickupPoint,
      returnPoint,
      pickupDate,
      returnDate,
      pickupTime,
      returnTime,
    });

    await booking.save();

    // Return available cars
    const availableCars = await Car.find({
      location: { $regex: `^${pickupPoint}$`, $options: 'i' },
      isAvailable: true,
    });
    

    res.status(200).json({
      message: "Booking successful!",
      cars: availableCars,
    });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Booking failed.' });
  }
});



app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
app.get('/my-bookings', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({
      message: 'Unauthorized'
    });
  }

  const bookings = await Booking.find({
    userId: req.session.user._id
  }).sort({
    createdAt: -1
  });
  res.json(bookings);
});
app.get('/admin/bookings', async (req, res) => {
  if (!req.session.user || !req.session.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied' });
  }

  const bookings = await Booking.find().populate('userId', 'fullName email');
  res.json(bookings);
});
app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
});
app.use(session({
  secret: 'car-rental-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 30 * 60 * 1000 // 30 minutes
  }
}));

app.get('/cars', async (req, res) => {
  const { pickupPoint } = req.query;
  const cars = await Car.find({ location: pickupPoint, isAvailable: true });
  res.json(cars);
});

app.post('/book-car/:id', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Login required" });

  const car = await Car.findById(req.params.id);
  if (!car || !car.isAvailable) return res.status(400).json({ message: "Car not available" });

  car.isAvailable = false;
  car.bookedBy = req.session.user._id;
  await car.save();

  res.json({ message: "Car booked successfully" });
});

app.get('/cars', async (req, res) => {
  const { pickupPoint } = req.query;

  try {
    const cars = await Car.find({ location: { $regex: pickupPoint, $options: 'i' }, isAvailable: true });
    res.json(cars);
  } catch (err) {
    console.error('Fetch cars error:', err);
    res.status(500).json({ message: 'Failed to load cars.' });
  }
});

// Book a specific car
app.post('/book-car/:id', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ message: "Login required" });

  try {
    const car = await Car.findById(req.params.id);

    if (!car || !car.isAvailable) {
      return res.status(400).json({ message: "Car not available or already booked" });
    }

    car.isAvailable = false;
    car.bookedBy = req.session.user._id;
    await car.save();

    res.json({ message: "Car booked successfully" });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Car booking failed' });
  }
});
