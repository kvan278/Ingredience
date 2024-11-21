const { deleteFirebaseUser } = require('../Helper/firebase-account')
const UserModel = require('../Models/User')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { generateFromEmail } = require('unique-username-generator')

const OTPRequestModel = require('../Models/OTPRequest')
const { sendOtpEmailForSignup, sendForgotPasswordMail, sendWelcomeMail } = require('../Helper/mail-helper')
const { APP_DATA } = require('../Config/app-information')
const { VALID_USER_ROLES } = require('../Helper/user-roles')
const ConstantService = require('../Service/ConstantsService')
const StringService = require('../Service/StringService')
const { getSuccessTemplate, getErrorTemplate } = require('../Helper/response-templates')

async function getEncryptedPassword(password) {
    const encryptedPassword = await bcrypt.hash(password, 10)
    return encryptedPassword
}

function generateUserId() {
    return crypto.randomUUID()
}

exports.signupv1 = async (req, res) => {
    try {
        const { email, password, code } = req.body

        const otpRequest = await OTPRequestModel.findOne({ email, code, type: 'signup', valid: true })
        if (!otpRequest || isOtpExpired(otpRequest.createdAt)) {
            return sendErrorResponse(res, 400, 'Invalid or expired OTP')
        }

        const emailExists = await UserModel.exists({ email })
        if (emailExists) {
            return sendErrorResponse(res, 400, 'Email already exists!')
        }

        const userID = generateUserId()
        const username = generateFromEmail(email, 2)
        const encryptedPassword = await getEncryptedPassword(password)
        const referralCode = await generateUniqueReferralCode()

        const user = await createUser(email, userID, username, encryptedPassword, referralCode)

        await invalidateOtp(email, code)

        user.authToken = generateAuthToken(userID, username, email)
        await updateUserAuthToken(email, user.authToken)

        res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'Signed up successfully',
                user
            }
        })
    } catch (error) {
        console.error('Error:', error)
        return sendErrorResponse(res, 500, 'Internal server error')
    }
}

// Helper function to generate unique referral code
const generateUniqueReferralCode = async () => {
    let referralCode
    let isUnique = false

    while (!isUnique) {
        referralCode = generateRandomCode()
        const codeExists = await UserModel.exists({ referralCode })
        if (!codeExists) {
            isUnique = true
        }
    }
    return referralCode
}

const generateRandomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
}

const isOtpExpired = (createdAt) => new Date().getTime() - createdAt > ConstantService.OTP_EXPIRY_DURATION

const sendErrorResponse = (res, status, message) => {
    res.status(status).json({
        status,
        message: 'error',
        data: {
            info: message
        }
    })
}

const createUser = async (email, userID, username, password, referralCode) => {
    await UserModel.updateOne(
        { uid: userID },
        {
            uid: userID,
            username,
            password,
            email,
            referralCode,
            createdAt: new Date().getTime(),
            lastActive: new Date().getTime()
        },
        { upsert: true }
    )
    const userList = await UserModel.find({ email })
    return userList[0]
}

const invalidateOtp = async (email, code) => {
    await OTPRequestModel.updateOne(
        { email, code, type: 'signup', valid: true },
        { $set: { valid: false } }
    )
}

const generateAuthToken = (uid, username, email) => {
    return jwt.sign({ uid, username, email }, process.env.JWT_TOKEN_KEY, {
        expiresIn: ConstantService.JWT_EXPIRY_DAY_STRING
    })
}

const updateUserAuthToken = async (email, authToken) => {
    await UserModel.updateOne(
        { email },
        { lastActive: new Date().getTime(), authToken }
    )
}

exports.signupv2 = async (req, res) => {
    try {
        const { email, password } = req.body

        // Check if the email already exists
        const emailExists = await UserModel.countDocuments({ email })
        if (emailExists > 0) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Email already exists!'
                }
            })
        }

        // Password hashing
        const userID = generateUserId()
        const randomUsername = generateFromEmail(email, 2)
        const encryptedPassword = await getEncryptedPassword(password)

        // Create new user or update if already exists (upsert)
        await UserModel.updateOne(
            { uid: userID },
            {
                uid: userID,
                username: randomUsername,
                password: encryptedPassword,
                email,
                createdAt: new Date().getTime(),
                lastActive: new Date().getTime()
            },
            { upsert: true }
        )

        // Fetch the newly created user
        const userList = await UserModel.aggregate([
            {
                $match: {
                    email
                }
            }
        ])

        const user = userList[0]

        // Create authentication token
        const authToken = jwt.sign({ email }, process.env.JWT_TOKEN_KEY, {
            expiresIn: ConstantService.JWT_EXPIRY_DAY_STRING
        })

        // Update user with auth token
        await UserModel.updateOne({ email }, { lastActive: new Date().getTime(), authToken })
        user.authToken = authToken

        res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'Signed up successfully',
                user
            }
        })
        sendWelcomeMail(email, authToken)
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

exports.deleteUser = async (req, res) => {
    try {
        const { uid } = req.params

        if (!uid) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'UID is required'
                }
            })
        }

        const user = await UserModel.findOne({ uid })
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'User does not exist'
                }
            })
        }

        // Delete the user from the database
        await UserModel.deleteOne({ uid })

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                info: 'User deleted successfully'
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

exports.handleFirebaseAuth = async (req, res) => {
    try {
        const { uid, email } = req.body
        let user = await UserModel.findOne({ email })

        if (user) {
            if (!user.firebaseID) {
                user.firebaseID = uid
            }
            user.lastActive = new Date().getTime()
        } else {
            // User does not exist, create a new user document
            const randomUsername = generateFromEmail(email, 2)
            user = new UserModel({
                uid: generateUserId(),
                firebaseID: uid,
                username: randomUsername,
                email,
                createdAt: new Date().getTime(),
                lastActive: new Date().getTime(),
                password: ''
            })
        }

        // Save the user document
        await user.save()

        // Create token
        const authToken = jwt.sign({ email }, process.env.JWT_TOKEN_KEY, {
            expiresIn: ConstantService.JWT_EXPIRY_DAY_STRING
        })
        user.authToken = authToken
        await UserModel.updateOne({ email }, { lastActive: new Date().getTime(), authToken })

        res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'Signed up successfully',
                user
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

exports.getUsersList = async (req, res) => {
    try {
        let { page = 1, limit = 100 } = req.query
        page = parseInt(page, 10)
        limit = parseInt(limit, 10)

        if (isNaN(page) || page < 1) page = 1
        if (isNaN(limit) || limit < 1) limit = 100

        const skip = (page - 1) * limit

        const aggregationPipeline = [
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
                $project: {
                    _id: 0,
                    password: 0,
                    authToken: 0,
                    __v: 0
                }
            }
        ]

        const users = await UserModel.aggregate(aggregationPipeline)

        const totalUsersPromise = UserModel.countDocuments()
        const [totalUsers] = await Promise.all([totalUsersPromise])

        const totalPages = Math.ceil(totalUsers / limit)

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                currentPage: page,
                totalPages,
                limit,
                totalUsers,
                users
            }
        })
    } catch (err) {
        console.error('Error in getLatestUsers:', err)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

exports.loginHandler = async (req, res) => {
    try {
        const { email, password } = req.body
        const emailExists = await UserModel.countDocuments({ email })
        if (emailExists === 0) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Email doesnot exists!'
                }
            })
        }

        if (!(email && password)) {
            return res.status(400).send(
                JSON.stringify({
                    status: 400,
                    message: 'error',
                    data: { info: 'All Inputs are required' }
                })
            )
        }

        const userList = await UserModel.aggregate([
            {
                $match: {
                    email
                }
            },
            {
                $project: {
                    _id: 0,
                    __v: 0
                }
            }
        ])

        const user = userList[0]

        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: { info: 'Invalid Credentials' }
            })
        }

        const authToken = jwt.sign({ email }, process.env.JWT_TOKEN_KEY, {
            expiresIn: ConstantService.JWT_EXPIRY_DAY_STRING
        })
        await UserModel.updateOne({ email }, { lastActive: new Date().getTime(), authToken })
        user.authToken = authToken
        res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'Signed in successfully',
                user
            }
        })
    } catch (err) {
        console.log('Error : ', err)
        res.status(500).json({
            status: 500,
            message: 'success',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

exports.loginHandlerV2 = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: { info: 'All inputs are required' }
            });
        }

        const user = await UserModel.findOne({ email }, { __v: 0 });

        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: { info: 'Email does not exist' }
            });
        }

        if (!user.isVerified) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: { info: 'Account is not verified' }
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: { info: 'Invalid credentials' }
            });
        }

        const authToken = jwt.sign({ email: user.email }, process.env.JWT_TOKEN_KEY, {
            expiresIn: ConstantService.JWT_EXPIRY_DAY_STRING
        });

        await UserModel.updateOne({ email }, { lastActive: new Date(), authToken });

        user.authToken = authToken;

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                info: 'Signed in successfully',
                user
            }
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({
            status: 500,
            message: 'error',
            data: { info: 'Internal server error' }
        });
    }
};

exports.markAccountAsVerified = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(404).send(getErrorTemplate('Verification Unsuccessful'))
        }

        let email;
        try {
            const decoded = jwt.verify(token, process.env.JWT_TOKEN_KEY);
            console.log('Decoded : ', decoded)
            email = decoded.email;
        } catch (err) {
            console.log('Err : ', err)
            return res.status(404).send(getErrorTemplate('Verification Link Expired'))
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).send(getErrorTemplate('Verification Unsuccessful'))
        }

        if (user.isVerified) {
            return res.status(200).send(getSuccessTemplate('Account already verified'));
        }

        user.isVerified = true;
        await user.save();

        return res.status(200).send(getSuccessTemplate('Account verified successfully'));
    } catch (err) {
        console.error('Error:', err);
        return res.status(404).send(getErrorTemplate('Something went wrong'))
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body

        // Check if required parameters are provided
        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'All inputs are required'
                }
            })
        }

        // Check if the email exists in the database
        const user = await UserModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Email does not exist'
                }
            })
        }

        // Verify old password
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
        if (!isPasswordValid) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Invalid old password'
                }
            })
        }

        // Hash the new password
        const encryptedNewPassword = await bcrypt.hash(newPassword, 10)

        // Update the password in the database
        await UserModel.updateOne({ email }, { password: encryptedNewPassword })

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                info: 'Password updated successfully'
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

exports.resetPasswordV2 = async (req, res) => {
    try {
        const { uid, newPassword } = req.body

        // Check if required parameters are provided
        if (!uid || !newPassword) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'UID and new password are required'
                }
            })
        }

        // Check if the uid exists in the database
        const user = await UserModel.findOne({ uid })
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'UID does not exist'
                }
            })
        }

        // Hash the new password
        const encryptedNewPassword = await bcrypt.hash(newPassword, 10)

        // Update the password in the database
        await UserModel.updateOne({ uid }, { password: encryptedNewPassword })

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                info: 'Password updated successfully'
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

exports.sendForgotPasswordLinkToMail = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Email does not exist'
                }
            });
        }
        const newPassword = StringService.generateRandomPassword();
        const encryptedNewPassword = await bcrypt.hash(newPassword, 10);
        await UserModel.updateOne({ email }, { password: encryptedNewPassword });
        sendForgotPasswordMail(email, newPassword);

        res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'New password sent successfully'
            }
        });
    } catch (err) {
        console.log('Error : ', err);
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        });
    }
};

exports.setNewPassword = async (req, res) => {
    try {
        const { email, code, newpassword } = req.body

        // Check if required parameters are provided
        if (!email || !code || !newpassword) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'All inputs are required'
                }
            })
        }

        // Find the OTP request in the database
        const otpRequest = await OTPRequestModel.findOne({ email, code, type: 'forgot_password', valid: true })
        if (!otpRequest || new Date().getTime() - otpRequest.createdAt > 10 * 60 * 1000) {
            // OTP is invalid or expired
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'Invalid or expired OTP'
                }
            })
        }
        // Hash the new password
        const encryptedNewPassword = await bcrypt.hash(newpassword, 10)

        // Update the password in the database
        await UserModel.updateOne({ email }, { password: encryptedNewPassword })

        // Invalidate the OTP
        otpRequest.valid = false
        await otpRequest.save()

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                info: 'Password updated successfully'
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

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
}
exports.sendOtpToEmail = async (req, res) => {
    try {
        const { email, type } = req.body

        if (type === 'signup') {
            // Check if email already exists in UserModel
            const emailAlreadyExists = await UserModel.countDocuments({ email })
            if (emailAlreadyExists > 0) {
                return res.status(400).json({
                    status: 400,
                    message: 'error',
                    data: {
                        info: 'Email already exists!'
                    }
                })
            }

            // Check if a valid OTP request for 'signup' already exists
            const existingOTPRequest = await OTPRequestModel.findOne({ email, type, valid: true })
            if (existingOTPRequest) {
                // Resend existing OTP
                sendOtpEmailForSignup(email, existingOTPRequest.code)
                return res.json({
                    status: 200,
                    message: 'success',
                    data: {
                        info: 'OTP has been resent!',
                        otp: existingOTPRequest.code
                    }
                })
            }
        }

        // Generate a new OTP and save to OTPRequestModel
        const generatedOTP = generateOTP()

        const newOTPRequest = new OTPRequestModel({
            email,
            code: generatedOTP,
            type,
            createdAt: new Date().getTime(),
            valid: true
        })

        await newOTPRequest.save()

        if (type === 'signup') {
            sendOtpEmailForSignup(email, generatedOTP)
        }

        res.json({
            status: 200,
            message: 'success',
            data: {
                info: 'OTP has been sent!',
                otp: generatedOTP
            }
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}

exports.handleUserAccount = async (req, res) => {
    try {
        const { uid, type } = req.body

        if (type === 'clearData') {
            await UserModel.updateOne({ uid }, { $set: { coins: 0, className: '', college: '' } })
        } else if (type === 'deleteAccount') {
            await UserModel.deleteOne({ uid })
            await deleteFirebaseUser(uid)
        }
        return res.json({
            status: 200,
            message: 'success',
            data: {
                info: `Action ${type} performed on ${uid}`
            }
        })
    } catch (err) {
        console.log('Error : ', err)
        return res.json({
            status: 400,
            message: 'error',
            data: { error: err }
        })
    }
}

exports.assignRole = async (req, res) => {
    try {
        const { uid, role } = req.body

        // Check if required parameters are provided
        if (!uid || !role || !VALID_USER_ROLES.includes(role)) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'UID and a valid role are required. Valid roles are: user, admin.'
                }
            })
        }

        // Check if the user exists in the database
        const user = await UserModel.findOne({ uid })
        if (!user) {
            return res.status(400).json({
                status: 400,
                message: 'error',
                data: {
                    info: 'User does not exist'
                }
            })
        }

        // Update the user's role in the database
        await UserModel.updateOne({ uid }, { role })

        res.status(200).json({
            status: 200,
            message: 'success',
            data: {
                info: `Role updated successfully to ${role}`
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

exports.handleDashboardLogin = async (req, res) => {
    const { username, password } = req.body

    try {
        const defaultUsername = APP_DATA.DEFAULT_ADMIN_USERNAME
        const defaultPassword = APP_DATA.DEFAULT_ADMIN_PASSWORD
        const defaultEmail = APP_DATA.DEFAULT_ADMIN_EMAIL

        if (
            (username === defaultUsername || username === defaultEmail) &&
            password === defaultPassword
        ) {
            const token = jwt.sign(
                { uid: APP_DATA.DEFAULT_ADMIN_ID, username: defaultUsername, role: ConstantService.USER_ROLES.ADMIN },
                APP_DATA.JWT_TOKEN_KEY,
                { expiresIn: '365d' }
            )

            return res.json({
                status: 200,
                message: 'success',
                data: {
                    username: defaultUsername,
                    token,
                    info: 'Login successful (Default Admin)'
                }
            })
        }

        // Check if username is in email format
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)

        // Search user by email if input is an email, otherwise search by username
        const user = isEmail
            ? await UserModel.findOne({ email: username })
            : await UserModel.findOne({ username })

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: 'error',
                data: {
                    info: 'User not found'
                }
            })
        }

        // Check if the password is correct
        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            return res.status(401).json({
                status: 401,
                message: 'error',
                data: {
                    info: 'Invalid credentials'
                }
            })
        }

        // Generate JWT token
        const token = jwt.sign(
            { uid: user.uid, username: user.username, role: user.role },
            process.env.JWT_TOKEN_KEY,
            { expiresIn: '365d' }
        )
        user.authToken = token // Add the token to the user object if needed for frontend

        return res.json({
            status: 200,
            message: 'success',
            data: {
                user,
                info: 'Login successful'
            }
        })
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            status: 500,
            message: 'error',
            data: {
                info: 'Internal server error'
            }
        })
    }
}
