//organize and give proper comments for the code for easy understanding
import jwt from "jsonwebtoken";
import CustomError from "../utils/customError.js";

const userAuthentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token =
    authHeader && authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

  if (!token) {
    const refreshmentToken = req.cookies?.refreshmentToken;

    if (!refreshmentToken) {
      return next(
        new CustomError("No access or refreshment token provided", 400)
      );
    }

    const decoded = jwt.verify(refreshmentToken, process.env.JWT_KEY);

    const newToken = jwt.sign(
      { id: decoded.id, username: decoded.username, email: decoded.email },
      process.env.JWT_KEY,
      { expiresIn: "1m" }
    );

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: true,
      maxAge: 1 * 60 * 1000,
      sameSite: "none",
    });

    req.user = decoded;
    return next();
  } else {
    try {
      const decoded = jwt.verify(token, process.env.JWT_KEY);

      req.user = decoded;
      return next();
    } catch (error) {
      const refreshmentToken = req.cookies?.refreshmentToken;
      if (!refreshmentToken) {
        return next(
          new CustomError("No access or refreshment token provided", 400)
        );
      }
      const decoded = jwt.verify(refreshmentToken, process.env.JWT_KEY);
      const newToken = jwt.sign(
        { id: decoded.id, username: decoded.username, email: decoded.email },
        process.env.JWT_KEY,
        { expiresIn: "1m" }
      );

      res.cookie("token", newToken, {
        httpOnly: true,
        secure: true,
        maxAge: 1 * 60 * 1000,
        sameSite: "none",
      });

      req.user = decoded;
      return next();
    }
  }
};

const adminAuth = (req, res, next) => {
  userAuthentication(req, res, () => {
    if (req.user && req.user.id === "admin") {
      return next();
    } else {
      throw new Error("access denied");
    }
  });
};
export { userAuthentication, adminAuth };
