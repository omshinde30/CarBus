const { v4: uuidv4 } = require('uuid');
const User = require("../model/users")
const {setuser} = require("../services/auth")
async function HandleUserSignUp(req, res) {
  const {
    name,
    email,
    password,
    phone
  } = req.body;

  await User.create({
    name,
    email,
    password,
    phone,
  });
  return res.redirect('/');
};

async function HandleUserLogin(req, res) {
  const {
    email,
    password
  } = req.body;
  const user = await User.findOne({
    email,
    password
  });
  if (!user)
    return res.render("login", {
      error: "Invalid Username or Password"
    });
  const sessionId = uuidv4();
  setuser(sessionId,user);
  res.cookie('uid',sessionId);
  return res.redirect('/');
}

module.exports = {
  HandleUserSignUp,
  HandleUserLogin
};