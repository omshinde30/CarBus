const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  name: String,
  imageUrl: String,
  description: String,
  location: String, // pickup point
  isAvailable: { type: Boolean, default: true },
  bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
});

module.exports = mongoose.model('Car', carSchema);


