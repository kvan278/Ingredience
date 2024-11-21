const UserModel = require('../Models/User')
const ContactQueryModel = require('../Models/ContactQuery')
const Joi = require('joi')

const updateUserRanks = async () => {
    try {
        const users = await UserModel.find().sort({ points: -1 })
        const bulkOperations = users.map((user, index) => ({
            updateOne: {
                filter: { _id: user._id },
                update: { rank: index + 1 }
            }
        }))
        await UserModel.bulkWrite(bulkOperations)

        console.log('User ranks updated successfully')
    } catch (error) {
        console.error('Error updating user ranks:', error)
    }
}

exports.getLeaderboardOfUsers = async (req, res) => {
    try {
        const page = req.query.page || 1

        const usersList = await UserModel.aggregate([
            {
                $sort: {
                    points: -1
                }
            },
            {
                $skip: (page - 1) * 15
            },
            {
                $limit: 100
            }
        ])
        res.json({
            status: 200,
            message: 'success',
            data: {
                list: usersList,
                page,
                info: 'Users has been fetched'
            }
        })
        updateUserRanks()
    } catch (err) {
        console.log('Error : ', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

const verifyUsername = async (username) => {
    try {
        const specialChars = /[!@#$%^&*(),.?":{}|<>]/
        const hasSpaces = /\s/

        if (specialChars.test(username)) {
            return {
                verified: false,
                reason: 'Special characters not allowed'
            }
        }

        if (hasSpaces.test(username)) {
            return {
                verified: false,
                reason: 'Space is not allowed'
            }
        }

        if (username.length < 6) {
            return {
                verified: false,
                reason: 'Username should be atleast 6 characters long'
            }
        }

        const isUsernameTaken = await UserModel.countDocuments({ username })
        if (isUsernameTaken > 0) {
            return {
                verified: false,
                reason: 'Username already taken by other user'
            }
        }

        return {
            verified: true,
            reason: 'Valid username'
        }
    } catch (error) {
        console.error('Error verifying username:', error.message)
        return {
            verified: false,
            reason: 'Error in verifying username'
        }
    }
}

exports.getUserProfileData = async (req, res) => {
    try {
        const uid = req.query.uid

        const usersList = await UserModel.aggregate([
            {
                $match: {
                    uid
                }
            }
        ]
        )
        await UserModel.updateOne({ uid }, { lastActive: new Date().getTime() })

        res.json({
            status: 200,
            message: 'success',
            data: {
                user: usersList[0],
                info: 'Users has been fetched'
            }
        })
    } catch (err) {
        console.log('Error : ', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

const allowedFieldsMap = {
    username: 'username',
    avatarURL: 'avatarURL',
    dietaryRestriction: 'dietaryRestriction'
}

const validateAndUpdateField = async (uid, key, value) => {
    // if (key === 'username') {
    //     const data = await verifyUsername(value)
    //     if (!data.verified) {
    //         return {
    //             success: false,
    //             reason: data.reason
    //         }
    //     }
    // }

    await UserModel.updateOne({ uid }, { [key]: value, lastActive: new Date().getTime() }, { upsert: true })
    return { success: true }
}

exports.updateUserProfile = async (req, res) => {
    try {
        const { uid, key, value } = req.body

        if (!allowedFieldsMap[key]) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Invalid key for update'
                }
            })
        }

        const updateResult = await validateAndUpdateField(uid, key, value)
        if (!updateResult.success) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: updateResult.reason
                }
            })
        }

        return res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'User data has been updated successfully'
            }
        })
    } catch (err) {
        console.log('Error : ', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}
exports.updateUserProfileV2 = async (req, res) => {
    try {
        const { uid, keysList } = req.body

        if (!Array.isArray(keysList) || keysList.length === 0) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Invalid or empty keysList array'
                }
            })
        }

        let invalidKeys = []
        let validUpdates = []

        for (const update of keysList) {
            const { key, value } = update

            if (!allowedFieldsMap[key]) {
                invalidKeys.push(key) // collect invalid keys
            } else {
                const updateResult = await validateAndUpdateField(uid, key, value)
                if (updateResult.success) {
                    validUpdates.push(key) // collect successfully updated keys
                } else {
                    invalidKeys.push(key) // consider invalid if update fails
                }
            }
        }

        return res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'User data has been updated',
                validKeys: validUpdates.length > 0 ? validUpdates : 'No valid updates',
                invalidKeys: invalidKeys.length > 0 ? invalidKeys : 'No invalid keys'
            }
        })
    } catch (err) {
        console.log('Error : ', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

exports.saveUserLocation = async (req, res) => {
    const { uid, latitude, longitude } = req.body

    try {
        // Define the Joi schema for validation
        const joiSchema = Joi.object({
            uid: Joi.string().required().messages({
                'string.empty': 'UID is required',
                'any.required': 'UID is required'
            }),
            latitude: Joi.number().required().messages({
                'number.base': 'Latitude must be a valid number',
                'any.required': 'Latitude is required'
            }),
            longitude: Joi.number().required().messages({
                'number.base': 'Longitude must be a valid number',
                'any.required': 'Longitude is required'
            })
        })

        // Validate the request body against the schema
        const { error } = joiSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: error.details[0].message
                }
            })
        }

        // Prepare the location data in GeoJSON format
        const locationData = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)] // GeoJSON requires [longitude, latitude]
        }

        // Upsert the user's location in the database
        const updatedUser = await UserModel.findOneAndUpdate(
            { uid: uid },
            { $set: { location: locationData } },
            { new: true, upsert: true }
        )

        // Respond with success
        res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'User location has been added or updated',
                userProfile: updatedUser
            }
        })
    } catch (error) {
        // Handle any errors that occur during the operation
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: error.message
            }
        })
    }
}

exports.searchUser = async (req, res) => {
    try {
        const { query } = req.query

        // Construct the regex for searching
        const regex = new RegExp(query, 'i') // 'i' makes it case-insensitive

        // Perform the search on email and username fields
        const users = await UserModel.find({
            $or: [
                { email: regex },
                { username: regex }
            ]
        })

        return res.json({
            status: 200,
            message: 'success',
            data: {
                users
            }
        })
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

exports.getContactFormsData = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query // default to page 1 and limit of 10 if not provided

        const data = await ContactQueryModel.aggregate([
            {
                $sort: {
                    createdAt: -1
                }
            },
            {
                $skip: (page - 1) * limit // calculate the number of documents to skip
            },
            {
                $limit: parseInt(limit) // limit the number of documents returned
            }
        ])

        const totalCount = await ContactQueryModel.countDocuments() // get the total number of documents

        res.json({
            status: 200,
            message: 'success',
            data: {
                list: data,
                currentPage: parseInt(page),
                totalPages: Math.ceil(totalCount / limit),
                totalItems: totalCount
            }
        })
    } catch (err) {
        console.log('Error: ', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}


exports.submitContactUs = async (req, res) => {
    try {
        const { name, email, message } = req.body

        const newContact = await ContactQueryModel.create({
            name,
            email,
            message,
            createdAt: new Date().getTime()
        })

        res.json({
            status: 200,
            message: 'success',
            data: {
                contactId: newContact._id,
                info: 'Your message has been submitted successfully'
            }
        })
    } catch (err) {
        console.log('Error: ', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

exports.updateContactUs = async (req, res) => {
    try {
        const { id } = req.params // Assuming you're passing the contact ID in the URL
        const { status } = req.body // Assuming the checkbox status is being sent in the body

        // Find the contact message by ID and update the status
        const updatedContact = await ContactQueryModel.findByIdAndUpdate(
            id,
            { status }, // Update the status field
            { new: true } // Return the updated document
        )

        if (!updatedContact) {
            return res.status(404).json({
                status: 404,
                message: 'error',
                data: {
                    info: 'Contact message not found'
                }
            })
        }

        res.json({
            status: 200,
            message: 'success',
            data: {
                contactId: updatedContact._id,
                updatedStatus: updatedContact.status,
                info: 'Contact message status updated successfully'
            }
        })
    } catch (err) {
        console.log('Error: ', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}
