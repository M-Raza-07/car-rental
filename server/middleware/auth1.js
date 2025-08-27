// import jwt from "jsonwebtoken";
// import User from "../models/user.js";

// export const protect = async (req, res, next) => {
//   const authHeader = req.headers.authorization;

//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Not authorized, no token" });
//   }

//   const token = authHeader.split(" ")[1]; // split "Bearer token"
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET); // returns "68937c49126928ff630b48a2"
//     console.log("✅ Decoded token:", decoded);

//     const user = await User.findById(decoded).select("-password");
//     console.log("✅ User found in DB:", user);

//     if (!user) {
//       return res
//         .status(401)
//         .json({ success: false, message: "User not found" });
//     }

//     req.user = user;
//     next();
//   } catch (error) {
//     console.log("❌ Error in protect middleware:", error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Your account cannot be authenticated.",
//     });
//   }
// };
