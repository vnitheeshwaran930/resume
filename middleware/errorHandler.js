/**
 * 404 Route Not Found Middleware
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Resource not found: ${req.method} ${req.originalUrl}`
    });
};

/**
 * Global Error Handler Middleware
 */
const errorHandler = (err, req, res, next) => {
    console.error(`\x1b[31m[Server Error] ${err.message}\x1b[0m`);
    if (err.stack && process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    }

    const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

    res.status(statusCode).json({
        success: false,
        message: err.isOperational ? err.message : 'An unexpected internal server error occurred. Please try again later.',
        ...(process.env.NODE_ENV === 'development' && {
            debugMessage: err.message,
            stack: err.stack
        })
    });
};

module.exports = {
    notFoundHandler,
    errorHandler
};
