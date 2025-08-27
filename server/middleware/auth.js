import jwt from "jsonwebtoken";
import user from "../models/user.js";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.json({ success: false, message: "Not authorized" });
  }
  try {
    const userId = jwt.decode(token, process.env.JWT_SECRET);

    if (!userId) {
      return res.json({ success: false, message: "Not authorized" });
    }
    req.user = await user.findById(userId).select("-password");
    next();
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Server error, please try again later",
      error: error.message,
    });
  }
};
