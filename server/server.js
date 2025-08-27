import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import ownerRouter from "./routes/ownerRouter.js";
import bookingRouter from "./routes/bookingsRoutes.js";

// Initialize the express app
const app = express();

// connect database
await connectDB();

// Middleware setup
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server is running CarRental"));
app.use("/api/user", userRouter);
app.use("/api/owner", ownerRouter);
app.use("/api/bookings", bookingRouter);

app.use((req, res) => {
  res.status(404).send("Route not found");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`server running on port ${PORT} `));
