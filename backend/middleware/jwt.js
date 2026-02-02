const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers["authorization"];

    if(!token) {
        return res.status(401).json({
            status : false,
            message : "Access denied. No token provided"
        })
    }

    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    
    next();

  } catch (error) {
    res.status(401).json({ 
        status: false, 
        message: "Invalid or expired token" 
    });
  }
};

const optionalVerifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) return next(); // No token → public access

  try {
   const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = {verifyToken , optionalVerifyToken};
