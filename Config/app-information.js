require('dotenv').config()

const APP_DATA = {
    NAME: process.env.PROJECT_NAME || 'Project Name',
    JWT_TOKEN_KEY: process.env.JWT_TOKEN_KEY || '',
    MAIL_ID: process.env.MAIL_ID || 'johndrake6481@gmail.com',
    MAIL_PASS: process.env.MAIL_PASS || 'bxkhbzhtwmzrmkge',
    S3_KEY_PREFIX: process.env.S3_KEY_PREFIX || 'media',
    MONGODB_URL: process.env.MONGODB_URL || '',
    DEFAULT_ADMIN_USERNAME: process.env.DEFAULT_ADMIN_USERNAME || '',
    DEFAULT_ADMIN_PASSWORD: process.env.DEFAULT_ADMIN_PASSWORD || '',
    DEFAULT_ADMIN_EMAIL: process.env.DEFAULT_ADMIN_EMAIL || '',
    DEFAULT_ADMIN_ID: process.env.DEFAULT_ADMIN_ID || ''
}

exports.APP_DATA = APP_DATA
