export const errorHandler = (err, req, res, next) => {
  console.error("🔴 Error:", err.message);
  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    error: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
