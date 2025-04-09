const jwt = require('jsonwebtoken');

function setuser(id , user) {
    SessionIdtoUserMap.set(id,user);
};
function getuser(id) {
    SessionIdtoUserMap.get(id);
};

module.exports= {
    setuser,getuser,
}