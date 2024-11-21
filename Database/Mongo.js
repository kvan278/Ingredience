const mongoose = require('mongoose');
const { APP_DATA } = require('../Config/app-information');
require('dotenv').config();

mongoose.set('strictQuery', false);

const DB_URL = APP_DATA.MONGODB_URL;

const connectToDatabase = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to Mongoose.');
    } catch (error) {
        console.error('Error in Mongoose connection:', error);
        throw error;
    }
};

module.exports = connectToDatabase;
