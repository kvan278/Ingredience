const app = require('./app.js');
const connectToDatabase = require('./Database/Mongo.js');
const port = process.env.PORT || 4020;

const startServer = async () => {
    try {
        await connectToDatabase();
        app.listen(port, () => {
            console.log(`Server is up and running on ${port}`);
        });
    } catch (error) {
        console.error('Failed to connect to the database. Server not started.');
    }
};

startServer();
