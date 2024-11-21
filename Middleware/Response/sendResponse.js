const statusMessages = {
    200: { message: 'Success' },
    400: { message: 'Bad Request' },
    401: { message: 'Unauthorized' },
    404: { message: 'Not Found' },
    500: { message: 'Internal Server Error' }
};

exports.sendResponse = (res, statusCode, data = {}, err = {}) => {
    const response = statusMessages[statusCode] || { message: 'Unknown Status' };
    const message = data.info || response.message;

    if (statusCode === 500) {
        console.log('Internal Server Error : ', err)
    }

    return res.status(statusCode).json({
        status: statusCode,
        message,
        data: {
            ...data,
            info: data.info || response.message
        }
    });
};
