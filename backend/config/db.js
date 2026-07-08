const mongoose = require("mongoose");
const User = require("../models/User");

const seedAdminUsers = async () => {
  const adminUsers = [
    {
      name: "Prasan Poudel",
      email: "prasanpoudel@zentor.com",
      password: "Password123",
      role: "admin",
    },
    {
      name: "Demo Admin",
      email: "demo_admin@zentor.com",
      password: "Password123",
      role: "admin",
    },
  ];

  for (const adminUser of adminUsers) {
    const existingUser = await User.findOne({ email: adminUser.email });
    if (!existingUser) {
      await User.create(adminUser);
      console.log(`Seeded admin user: ${adminUser.email}`);
    }
  }
};

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.host}`);

  await seedAdminUsers();
};

module.exports = connectDB;
