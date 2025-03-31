const {getuser} = require("../services/auth");

async function restrictToLoggedInUserOnly(req,res,next){
    const userId = req.cookies?.uid;
    if(!userId) return res.redirect("/login");
    const user = getuser(userId);
    if(!user) return res.redirect("/login");
    req.user = user;
    next();
};

module.exports = {restrictToLoggedInUserOnly}