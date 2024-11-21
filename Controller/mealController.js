// services/mealService.js
const Joi = require('joi');
const Inventory = require('../Models/Inventory');
const Meal = require('../Models/Meal');

// Get all inventory items for a user
exports.getInventoryOfUser = async (req, res) => {
    const { uid, threshold } = req.query;

    try {
        // Create a query object
        const query = { uid };
        // If threshold is true, filter items with quantity less than threshold
        if (threshold === 'true') {
            query.$expr = { $lte: ['$quantity', '$threshold'] };
        }

        const inventoryItems = await Inventory.find(query).sort({ name: 1 });

        res.json({
            status: 200,
            message: 'success',
            data: { inventory: inventoryItems }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error',
            data: { info: error.message }
        });
    }
};

// Helper function to get unique ingredients
const getAllUniqueIngredients = async () => {
    const meals = await Meal.find();
    const ingredientSet = new Set();

    for (const meal of meals) {
        const ingredients = meal.ingredients;
        if (ingredients && Array.isArray(ingredients)) {
            ingredients.forEach((ingredient) => {
                if (ingredient && typeof ingredient === 'string' && ingredient.trim() !== '') {
                    ingredientSet.add(ingredient.trim());
                }
            });
        }
    }

    return Array.from(ingredientSet);
};

exports.getUserMeals = async (req, res) => {
    const { uid } = req.query;

    try {
        // Fetch all inventory items for the user
        const inventoryItems = await Inventory.find({ uid });

        // Extract all item names from the inventory
        const inventoryNames = inventoryItems.map((item) => item.name);

        if (inventoryNames.length === 0) {
            return res.json({
                status: 200,
                message: 'success',
                data: { meals: [] } // Return an empty array if no inventory items
            });
        }

        // Find all meals that contain any of the inventory item names in their ingredients
        const meals = await Meal.find({
            ingredients: { $in: inventoryNames }
        });

        res.json({
            status: 200,
            message: 'success',
            data: { meals }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error',
            data: { info: error.message }
        });
    }
};

// Define the controller function to handle the route
exports.getIngredientsList = async (req, res) => {
    try {
        const uniqueIngredients = await getAllUniqueIngredients();

        res.json({
            status: 200,
            message: 'success',
            data: { ingredients: uniqueIngredients }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error',
            data: { info: error.message }
        });
    }
};

// Add a new inventory item for a user
exports.addInventoryOfUser = async (req, res) => {
    const inventorySchema = Joi.object({
        uid: Joi.string().required(),
        name: Joi.string().required(),
        category: Joi.string().required(),
        expiration: Joi.number().integer().required(), // Expiration in ms
        threshold: Joi.number().integer().required(),
        quantity: Joi.number().integer().required()
    });

    const { error } = inventorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: 'error',
            data: { info: error.details[0].message }
        });
    }

    try {
        const newInventoryItem = new Inventory({ ...req.body, createdAt: Date.now(), updatedAt: Date.now() });
        await newInventoryItem.save();
        res.json({
            status: 200,
            message: 'Inventory item added successfully',
            data: { inventory: newInventoryItem }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error',
            data: { info: error.message }
        });
    }
};

// Update an existing inventory item
exports.updateInventoryOfUser = async (req, res) => {
    const { id } = req.params;

    const inventorySchema = Joi.object({
        name: Joi.string(),
        category: Joi.string(),
        expiration: Joi.number().integer(),
        threshold: Joi.number().integer(),
        quantity: Joi.number().integer()
    });

    const { error } = inventorySchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            status: 400,
            message: 'error',
            data: { info: error.details[0].message }
        });
    }

    try {
        const updatedInventoryItem = await Inventory.findByIdAndUpdate(
            id,
            { ...req.body, updatedAt: Date.now() },
            { new: true }
        );

        if (!updatedInventoryItem) {
            return res.status(404).json({
                status: 404,
                message: 'error',
                data: { info: 'Inventory item not found' }
            });
        }

        res.json({
            status: 200,
            message: 'Inventory item updated successfully',
            data: { inventory: updatedInventoryItem }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error',
            data: { info: error.message }
        });
    }
};

// Delete an inventory item
exports.deleteInventoryItemOfUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedInventoryItem = await Inventory.findByIdAndDelete(id);
        if (!deletedInventoryItem) {
            return res.status(404).json({
                status: 404,
                message: 'error',
                data: { info: 'Inventory item not found' }
            });
        }

        res.json({
            status: 200,
            message: 'Inventory item deleted successfully',
            data: { info: 'Inventory item has been removed' }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error',
            data: { info: error.message }
        });
    }
};
