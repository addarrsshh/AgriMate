const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.stack || err.message);

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || "An unexpected internal server error occurred",
      statusCode,
      path: req.originalUrl,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = errorHandler;
