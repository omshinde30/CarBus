// middlewares/profileCheck.js
const User = require('./User');

async function isProfileCompleted(req, res, next) {
  const userId = req.session.user._id;
  const user = await User.findById(userId);
  if (user && user.profileCompleted) {
    next();
  } else {
    res.redirect('/complete-profile');
  }
}

module.exports = { isProfileCompleted };
