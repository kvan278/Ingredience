class ConstantService {
    static USER_ROLES = {
        ADMIN: 'admin',
        USER: 'user',
        MODERATOR: 'moderator'
    };

    static USER_ROLES_LIST = Object.values(ConstantService.USER_ROLES);

    // Application Statuses
    static STATUS = {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        PENDING: 'pending',
        DELETED: 'deleted'
    };

    static STATUS_LIST = Object.values(ConstantService.STATUS);

    // Error Messages
    static ERROR_MESSAGES = {
        NOT_FOUND: 'Resource not found',
        INVALID_INPUT: 'Invalid input',
        FORBIDDEN: 'You do not have permission to perform this action',
        UNAUTHORIZED: 'You must be logged in to perform this action',
        SERVER_ERROR: 'An unexpected error occurred on the server'
    };

    // Configuration Values
    static CONFIG = {
        MAX_LOGIN_ATTEMPTS: 5,
        PASSWORD_RESET_TOKEN_EXPIRY: 3600, // in seconds (1 hour)
        JWT_EXPIRY: '1d', // JWT expiration time (1 day)
        SUPPORT_EMAIL: 'support@example.com',
        DEFAULT_PAGE_SIZE: 20
    };

    // MIME Types
    static MIME_TYPES = {
        JPEG: 'image/jpeg',
        PNG: 'image/png',
        PDF: 'application/pdf',
        DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };

    static ALLOWED_FILE_TYPES = [ConstantService.MIME_TYPES.JPEG, ConstantService.MIME_TYPES.PNG, ConstantService.MIME_TYPES.PDF];

    // Other Constants
    static CURRENCIES = ['USD', 'EUR', 'GBP', 'CAD'];
    static COUNTRIES = ['US', 'CA', 'GB', 'AU', 'FR', 'DE'];
    static SUPPORTED_LANGUAGES = ['en', 'fr', 'de', 'es'];
    static DATE_FORMAT = 'YYYY-MM-DD';

    static OTP_EXPIRY_DURATION = 60 * 60 * 1000
    static JWT_EXPIRY_DAY_STRING = '180d'

    // Environment-Specific Configurations
    static ENV = {
        DEVELOPMENT: 'development',
        PRODUCTION: 'production',
        TEST: 'test'
    };

    static isProduction() {
        return process.env.NODE_ENV === ConstantService.ENV.PRODUCTION;
    }

    static isDevelopment() {
        return process.env.NODE_ENV === ConstantService.ENV.DEVELOPMENT;
    }

    static COMMON_ASSETS = {
        BOY_AVATAR: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/212884_569155.webp',
        FIRE_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/230050566_600684531.png',
        PASSWORD_RESET_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/597742728_208856788.png',
        WELCOME_BANNER: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/18262372_325330784.png',
        OTP_ICON: 'https://common-icons.s3.ap-south-1.amazonaws.com/attachments/tickets/320104527_242998628.png'
    }

    static COMMON_URLS = {
        JSON_PLACEHOLDER_USERS: 'https://jsonplaceholder.typicode.com/users',
        REQRES_USERS: 'https://reqres.in/api/users?per_page=12',
        RANDOM_DOG_IMAGE: 'https://dog.ceo/api/breeds/image/random',
        RANDOM_CAT_IMAGE: 'https://api.thecatapi.com/v1/images/search',
        FAKER_API_BOOKS: 'https://fakerapi.it/api/v1/books',
        RANDOM_USER: 'https://randomuser.me/api',
        PICSUM_PHOTO: 'https://picsum.photos/600/350',
        DUMMY_JSON_PRODUCTS: 'https://dummyjson.com/products',
        DUMMY_JSON_USERS: 'https://dummyjson.com/users'
    }

    static MAIL_TEMPLATES = {
        FORGOT_PASSWORD: 'forgot_password',
        WELCOME_USER: 'welcome_user',
        SIGNUP_OTP: 'signup_otp'
    }
}

module.exports = ConstantService;
