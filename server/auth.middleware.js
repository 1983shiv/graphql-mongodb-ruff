import jwt from "jsonwebtoken";
// import { JWT_SECRET } from "../config/env.js"; // Your secret key

const JWT_SECRET = process.env.JWT_SECRET || "helloshiv";

// Middleware to protect GraphQL endpoints
export const authenticate = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer token"

    // If there is no token, return an error
    if (!token) {
      const error = new Error("Authentication failed. Token is missing.");
      error.statusCode = 401;
      throw error;
    }

    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Attach the user info to the request object (you can access it in your resolvers)
    req.user = { id: decoded.id, email: decoded.email };

    // Call the next middleware or resolver
    next();
  } catch (error) {
    console.error(error.message);
    res.status(401).json({ message: "Authentication failed." });
  }
};
