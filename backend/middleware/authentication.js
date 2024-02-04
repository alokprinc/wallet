const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config.js");

// verify Token
function verifyToken(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ message: "Access Denied" });
  }
  try {
    const verified_data = jwt.verify(token, JWT_SECRET);
    req.userId = verified_data._id;
    // console.log("middleware -> ", req.userId);
    // console.log("middleware -> ", verified_data);
    next();
  } catch (err) {
    res.status(500).json({ message: "Access denied : Invalid Token" });
  }
}

module.exports = { verifyToken };
