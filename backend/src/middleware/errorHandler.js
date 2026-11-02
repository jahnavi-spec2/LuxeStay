import ApiError from "../utils/Apierror.js";

const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Zod validation errors (if added in the future)
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: err.issues,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value",
      details: err.keyValue,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: Object.values(err.errors).map((error) => error.message),
    });
  }

  console.error("Unhandled error:", err);
  return res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
};

export default errorHandler;
