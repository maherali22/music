const ErrorManager = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server error";
  console.log(err);
  const status = err.status || "error";

  return res.status(statusCode).json({
    statusCode,
    message,
    status,
    data
  });
};
export default ErrorManager;
