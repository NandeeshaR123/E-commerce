require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./src/models/user');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI environment variable is not set");
    }
    
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error("Error while connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  try {
    await connectDB();

    // Get admin details from command line arguments or use defaults
    const firstName = process.argv[2] || 'Admin';
    const lastName = process.argv[3] || 'User';
    const username = process.argv[4] || 'admin';
    const email = process.argv[5] || 'admin@example.com';
    const password = process.argv[6] || 'admin123';

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('Admin user already exists with this email or username.');
        process.exit(0);
      } else {
        // Update existing user to admin
        existingUser.role = 'admin';
        existingUser.firstName = firstName;
        existingUser.lastName = lastName;
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        await existingUser.save();
        console.log(`User ${existingUser.username} has been promoted to admin.`);
        process.exit(0);
      }
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash(password, 10);
    const adminUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      role: 'admin',
    });

    await adminUser.save();
    console.log(`Admin user created successfully!`);
    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`Username: ${username}`);
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    console.log('\n⚠️  Please change the password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

createAdmin();

