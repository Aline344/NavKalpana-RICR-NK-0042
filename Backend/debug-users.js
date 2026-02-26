import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import User from './models/User.js';

dotenv.config({ path: path.resolve('Backend/.env') });

const checkUser = async (email) => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOne({ email: email.toLowerCase().trim() });
        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Role: ${user.role}`);
            console.log(`Created At: ${user.createdAt}`);
        } else {
            console.log(`User NOT found: ${email}`);
        }

        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

// Replace with the email the user is complaining about if known, or just list recent users
const listRecent = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const users = await User.find().sort({ createdAt: -1 }).limit(5);
        console.log('Recent 5 users:');
        users.forEach(u => console.log(` - ${u.email} (${u.role}) [${u.createdAt}]`));
        await mongoose.disconnect();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

listRecent();
