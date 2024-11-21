// models/Inventory.js
const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    uid: { type: String, required: true }, // User ID to associate inventory with a user
    name: { type: String, required: true },
    category: { type: String, required: true },
    expiration: { type: Number, required: true }, // Stored in milliseconds
    threshold: { type: Number, required: true },
    quantity: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model(
    'Inventory',
    inventorySchema,
    'Inventory'
);
