import imagekit from "../configs/imagekit.js";
import fs from "fs";
import Car from "../models/Car.js";
import User from "../models/user.js";
import Booking from "../models/booking.js";

// API to change user role to owner
export const changeRoleToOwner = async (req, res) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { role: "owner" });
    res.status(200).json({ success: true, message: "Now you can list cars" });
  } catch (error) {
    console.log(error.message);
    res.status(401).json({ success: false, message: error.message });
  }
};

// API to list Car
export const addCar = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Not authorized" });
    }

    const { _id } = req.user;

    // parse car data from request body
    let car = JSON.parse(req.body.carData);

    // check file
    const imageFile = req.file;
    if (!imageFile) {
      return res
        .status(400)
        .json({ success: false, message: "Image file missing" });
    }

    // Upload image to image kit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/cars",
    });
    console.log("Image uploaded successfully");

    // Optimization through URL transformation
    let optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "1280" }, // width resize
        { quality: "auto" }, // Automatically adjust quality
        { format: "webp" }, // convert to modern format
      ],
    });

    const image = optimizedImageUrl;

    await Car.create({ ...car, owner: _id, image });

    res.status(200).json({ success: true, message: "Car Added" });
  } catch (error) {
    console.log("Error in addCar", error);
    res.json({ success: false, message: error.message });
  }
};

// API to List Owner Cars
export const getOwnerCars = async (req, res) => {
  try {
    const { _id } = req.user;
    const cars = await Car.find({ owner: _id });
    res.json({ success: true, cars });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to Toggle for Car Availability\
export const toggleCarAvailability = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    // check if car belongs to the owner
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    car.isAvailable = !car.isAvailable;
    await car.save();

    res.json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to delete a car
export const deleteCar = async (req, res) => {
  try {
    const { _id } = req.user;
    const { carId } = req.body;

    const car = await Car.findById(carId);

    if (!car) {
      return res.json({ success: false, message: "Car not found" });
    }

    // check if car belongs to the owner
    if (car.owner.toString() !== _id.toString()) {
      return res.json({ success: false, message: "Unauthorized" });
    }

    // Check if car has active bookings
    const activeBookings = await Booking.find({
      car: carId,
      returnDate: { $gte: new Date() }, // Future or ongoing bookings
    });

    if (activeBookings.length > 0) {
      console.log(`Car has ${activeBookings.length} active bookings`);
      return res.json({
        success: false,
        message: "Cannot delete car with active bookings",
      });
    }

    // car.owner = null;
    // car.isAvailable = false;
    // await car.save();
    // Actually delete the car from database
    await Car.findByIdAndDelete(carId);
    console.log("Car successfully deleted from database");

    res.json({ success: true, message: "Car Removed" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.json({ success: false, message: "Unauthorized" });
    }

    const cars = await Car.find({ owner: _id });

    const bookings = await Booking.find({ owner: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    const pendingBookings = await Booking.find({
      owner: _id,
      status: "pending",
    });

    const completedBookings = await Booking.find({
      owner: _id,
      status: "confirmed",
    });

    // Calculate total monthly revenur form bookings where status is confiremed
    const monthlyRevenue = bookings
      .slice()
      .filter((booking) => booking.status === "confirmed")
      .reduce((acc, booking) => acc + booking.price, 0);

    const dashboardData = {
      totalCars: cars.length,
      totalBookings: bookings.length,
      pendingBookings: pendingBookings.length,
      completedBookings: completedBookings.length,
      recentBookings: bookings.slice(0, 3),
      monthlyRevenue: monthlyRevenue,
    };

    res.status(200).json({ success: true, dashboardData: dashboardData });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API TO UPDATE USER IMAGE
export const updateUserImage = async (req, res) => {
  try {
    const { _id } = req.user;

    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "No image file provided" });
    }

    // Upload image to image kit
    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/users",
    });
    console.log("Image uploaded successfully");

    // Optimization through URL transformation
    let optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { width: "400" }, // width resize
        { quality: "auto" }, // Automatically adjust quality
        { format: "webp" }, // convert to modern format
      ],
    });

    // Use findByIdAndUpdate instead of findById to actually save the image
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { image: optimizedImageUrl },
      { new: true } // return the updated document
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // clean up the temporary uploaded file
    if (fs.existsSync(imageFile.path)) {
      fs.unlinkSync(imageFile.path);
    }

    res.status(200).json({
      success: true,
      message: "Image updated successfully",
      imageUrl: optimizedImageUrl,
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
