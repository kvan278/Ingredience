const ContactQuery = require("../Models/ContactQuery")
const Category = require('../Models/Category')
const MailLog = require('../Models/MailLog')
const Media = require('../Models/Media')
const OTPRequest = require('../Models/OTPRequest')
const Question = require('../Models/Question')
const Quiz = require('../Models/Quiz')
const QuizSubmission = require('../Models/QuizSubmission')
const RequestLog = require('../Models/RequestLog')
const Subject = require('../Models/Subject')
const User = require('../Models/User')

exports.ALLOWED_MONGO_COLLECTIONS = {
    "ContactQuery": ContactQuery,
    "Category": Category,
    "MailLog": MailLog,
    "Media": Media,
    "OTPRequest": OTPRequest,
    "Question": Question,
    "Quiz": Quiz,
    "QuizSubmission": QuizSubmission,
    "RequestLog": RequestLog,
    "Subject": Subject,
    "User": User
};