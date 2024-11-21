const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    role: {
        type: String,
        default: 'user'
    },
    authToken: {
        type: String
    },
    firebaseID: {
        type: String
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Invalid email address'],
        index: true
    },
    username: {
        type: String,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String
    },
    points: {
        type: Number,
        default: 0
    },
    rank: {
        type: Number,
        default: 18
    },
    avatarURL: {
        type: String,
        default: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/212884_569155.webp'
    },
    createdAt: {
        type: Number
    },
    lastActive: {
        type: Number
    },
    location: {
        type: Object
    },
    referralCode: {
        type: String
    },
    dietaryRestriction: {
        type: String
    }
})

module.exports = mongoose.model('Users', UserSchema, 'Users')
