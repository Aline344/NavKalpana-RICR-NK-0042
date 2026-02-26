import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User.js';

dotenv.config({ path: path.resolve('Backend/.env') });

const testAuth = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const testEmail = 'test_debug@example.com';
        const testPass = 'password123';

        // 1. Cleanup
        await User.deleteOne({ email: testEmail });
        console.log('Cleaned up test user');

        // 2. Register
        const user = await User.create({
            name: 'Debug User',
            email: testEmail,
            password: testPass
        });
        console.log('User registered successfully');

        // 3. Login
        const foundUser = await User.findOne({ email: testEmail });
        console.log('Found user for login check');

        const isMatch = await foundUser.matchPassword(testPass);
        console.log(`Password match: ${isMatch}`);

        const isWrongMatch = await foundUser.matchPassword('wrongpassword');
        console.log(`Wrong password match: ${isWrongMatch} (Should be false)`);

        if (isMatch && !isWrongMatch) {
            console.log('AUTH LOGIC IS WORKING CORRECTLY');
        } else {
            console.log('AUTH LOGIC FAILED');
        }

        await User.deleteOne({ email: testEmail });
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

testAuth();
