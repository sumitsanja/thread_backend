const User = require("../models/user-model");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ msg: "No token provided!" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken || !decodedToken.token) {
      return res.status(401).json({ msg: "Invalid token!" });
    }
    const user = await User.findById(decodedToken.token)
      .populate("followers")
      .populate("threads")
      .populate("replies")
      .populate("reposts");
    if (!user) {
      return res.status(404).json({ msg: "User not found!" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Authentication error!", error: err.message });
  }
};

module.exports = auth;
