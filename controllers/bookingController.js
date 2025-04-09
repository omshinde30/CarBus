exports.showProfileForm = (req, res) => {
    res.render('profile-form');
  };
  
  exports.submitProfileForm = async (req, res) => {
    const userId = req.session.user._id;
    const { license, address, age } = req.body;
  
    await User.findByIdAndUpdate(userId, {
      license,
      address,
      age,
      profileCompleted: true
    });
  
    res.redirect('/book');
  };
  