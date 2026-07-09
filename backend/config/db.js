const mongoose = require("mongoose");
const User = require("../models/User");

const seedUsersFunction = async () => {
  const seedUsers = [
    {
      name: "Prasan Poudel",
      email: "prasanpoudel_admin@zentro.com",
      password: "Password123",
      role: "admin",
    },
    {
      name: "Demo Admin",
      email: "admin@zentro.com",
      password: "Password123",
      role: "admin",
    },
    {
      name: "Demo Customer",
      email: "customer@zentro.com",
      password: "Password123",
      role: "customer",
      addresses: [],
    }
  ];

  for (const user of seedUsers) {
    const existingUser = await User.findOne({ email: user.email });
    if (!existingUser) {
      await User.create(user);
      console.log(`Seeded user: ${user.email}`);
    }
  }
};

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI, {
    dbName: "ecommerce",
  });
  console.log(`MongoDB Connected: ${conn.connection.host}`);

  await seedUsersFunction();
};

module.exports = connectDB;
