const errorHandler = (err, req, res, next) => {
    console.error('\n❌ UNHANDLED ERROR ❌');
    console.error('Error:', err);
    console.error('Request URL:', req.url);
    console.error('Request method:', req.method);
    console.error('Error stack:', err.stack);
    console.error('========================================\n');

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);

    res.json({
        success: false,
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = { errorHandler };
