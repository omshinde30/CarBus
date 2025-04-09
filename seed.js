const mongoose = require('mongoose');
const Car = require('./models/Car');

mongoose.connect('mongodb://localhost:27017/car_rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB for seeding");
}).catch(err => {
  console.error("MongoDB connection error:", err);
});

const cars = [
  { name: 'Swift', type: 'Hatchback', location: 'Pune', imageUrl: 'images/swift.jpg' },
  { name: 'XUV700', type: 'SUV', location: 'Mumbai', imageUrl: 'images/xuv700.jpg' },
  { name: 'Innova', type: 'MUV', location: 'Pune', imageUrl: 'images/innova.jpg' },
  { name: 'Verna', type: 'Sedan', location: 'Mumbai', imageUrl: 'images/verna.jpg' },
];

async function seedCars() {
  try {
    await Car.deleteMany(); // optional: clears existing cars
    await Car.insertMany(cars);
    console.log("🚗 Car data seeded successfully!");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.disconnect();
  }
}

seedCars();
