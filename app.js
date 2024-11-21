const express = require('express')
const app = express()
require('dotenv').config()

const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const fileupload = require('express-fileupload')

const { NOT_FOUND_TEMPLATE_2 } = require('./Helper/response-templates')
const morganLogger = require('./Helper/morgan-logger')
const inputSanitizer = require('./Middleware/Request/inputSanitizer')
const requestLogger = require('./Helper/logger')

app.use(helmet())
app.use(cors())
app.use(morganLogger)
app.use(express.urlencoded({ extended: false, limit: '750mb' }));
app.use(express.json({ limit: '750mb' }));
app.use(requestLogger)
app.use(fileupload())
app.use(compression())
app.use(inputSanitizer)

const testRoute = require('./Routes/testRoute')
const authRoute = require('./Routes/authRoute')
const mealRoute = require('./Routes/mealRoute')
const userRoute = require('./Routes/userRoute')

app.use(testRoute)
app.use(authRoute)
app.use(mealRoute)
app.use(userRoute)

// Catch-all route for undefined routes
app.use('*', (req, res) => {
    res.status(404).send(NOT_FOUND_TEMPLATE_2)
})

module.exports = app
