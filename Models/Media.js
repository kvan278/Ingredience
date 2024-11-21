const mongoose = require("mongoose");

const BucketMediaSchema = mongoose.Schema({
    url: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
    },
    createdAt: {
        type: Number
    },
    updatedAt: {
        type: Number
    }
});

module.exports = mongoose.model(
    "Media",
    BucketMediaSchema,
    "Media"
);
