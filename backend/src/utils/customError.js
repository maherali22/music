class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    console.log("message:", message);
    this.statusCode = statusCode || 500;
    this.status = statusCode >= 400 && statusCode <= 500 ? "failed" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
export default CustomError;
