const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,

    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    phone:{
        type:Number,
        required:true
    }
}, {
    timestamps: true,
});

const User = mongoose.model("users", UserSchema);
module.exports = User;