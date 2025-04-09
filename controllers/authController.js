const User = require('../models/users');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { fullName, email, password, phone } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, password: hashedPassword, phone });
    await user.save();

    req.session.user = user;

    const names = fullName.trim().split(" ");
    const initials = (names[0][0] + (names[1]?.[0] || '')).toUpperCase();

    res.json({ initials });
  } catch (err) {
    console.error("Error registering user:", err);
    res.status(500).send("Registration failed.");
  }
};


exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && await bcrypt.compare(password, user.password)) {
      req.session.user = user;
      
      // Get initials
      const names = user.fullName.trim().split(" ");
      const initials = (names[0][0] + (names[1]?.[0] || '')).toUpperCase();

      res.json({ initials });
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error.");
  }
};


exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};
