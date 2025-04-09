const mongoose = require('mongoose');
const Car = require('./models/Car');

mongoose.connect('mongodb://localhost:27017/car_rental', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cars = [
  {
    name: "Swift Dzire",
    imageUrl: "/images/swiftdzire.jpg",
    description: "A reliable sedan for city and highway drives.",
    location: "pune",
    isAvailable: true
  },
  {
    name: "Swift",
    imageUrl: "/images/swift.jpg",
    description: "Perfect for zipping through city traffic.",
    location: "satara",
    isAvailable: true
  },
  {
    name: "Baleno",
    imageUrl: "/images/baleno.jpg",
    description: "Speed things up, and screech off towards your dream destination!",
    location: "nashik",
    isAvailable: true
  },
  {
    name: "Altroz",
    imageUrl: "/images/altroz.jpg",
    description: "A premium hatchback with bold looks.",
    location: "mumbai",
    isAvailable: true
  },
  {
    name: "Kwid",
    imageUrl: "/images/kwid.jpg",
    description: "Compact and comfortable for everyday drives.",
    location: "pune",
    isAvailable: true
  },
  {
    name: "Tiago",
    imageUrl: "/images/tiago.jpg",
    description: "A perfect mix of mileage and comfort.",
    location: "kolhapur",
    isAvailable: true
  },
  {
    name: "Ace",
    imageUrl: "/images/ace.jpg",
    description: "For your commercial needs and cargo moves.",
    location: "pune",
    isAvailable: true
  },
  {
    name: "Eeco",
    imageUrl: "/images/eeco.jpg",
    description: "Ideal for family trips and tours.",
    location: "pune",
    isAvailable: true
  },
  {
    name: "Traveller",
    imageUrl: "/images/traveller.jpg",
    description: "Comfortable for group travels and long tours.",
    location: "pune",
    isAvailable: true
  },
  {
    name: "Bolero",
    imageUrl: "/images/bolero.jpg",
    description: "Powerful SUV for tough terrains.",
    location: "pune",
    isAvailable: true
  },
  {
    name: "Hilux",
    imageUrl: "/images/hilux.jpg",
    description: "Luxury pickup with bold design.",
    location: "pune",
    isAvailable: true
  },
  {
    name: "Magic",
    imageUrl: "/images/magic.jpg",
    description: "Perfect for small logistics and crew transport.",
    location: "pune",
    isAvailable: true
  }
];

async function seed() {
  try {
    await Car.deleteMany({});
    await Car.insertMany(cars);
    console.log("✅ Cars seeded successfully.");
  } catch (err) {
    console.error("❌ Error seeding cars:", err);
  } finally {
    mongoose.disconnect();
  }
}

seed();
