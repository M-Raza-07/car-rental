import Booking from "../models/booking.js";
import Car from "../models/Car.js";

// Function to check Availability of car for a given return date
const checkAvailability = async (car, pickupDate, returnDate) => {
  // Convert strings to Date objects for proper comparison
  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);

  const bookings = await Booking.find({
    car,
    $or: [
      // Booking starts during requested period
      {
        pickupDate: { $gte: pickup, $lt: returnD },
      },
      // Booking ends during requested period
      {
        returnDate: { $gt: pickup, $lte: returnD },
      },
      // Booking spans the entire requested period
      {
        pickupDate: { $lte: pickup },
        returnDate: { $gte: returnD },
      },
    ],
  });
  return bookings.length === 0;
};

// API to check Availability of cars for the given Date and location
export const checkAvailabilityOfCar = async (req, res) => {
  try {
    const { location, pickupDate, returnDate } = req.body;

    // Validate required fields
    if (!location || !pickupDate || !returnDate) {
      return res.status(400).json({
        success: false,
        message: "Location, pickup date, and return date are required",
      });
    }

    // Validate date logic
    if (new Date(pickupDate) >= new Date(returnDate)) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    // Fetch all cars for the given location (remove isAvailable filter)
    const cars = await Car.find({ location });

    if (cars.length === 0) {
      return res.json({
        success: true,
        availableCars: [],
        message: "No cars found for this location",
      });
    }

    // Check car availability for the given date range using promise
    const availableCarsPromises = cars.map(async (car) => {
      const isDateAvailable = await checkAvailability(
        car._id,
        pickupDate,
        returnDate
      );
      return { ...car._doc, isDateAvailable };
    });

    let availableCars = await Promise.all(availableCarsPromises);

    // Filter only cars that are available for the requested dates
    availableCars = availableCars.filter((car) => car.isDateAvailable === true);

    res.json({ success: true, availableCars, total: availableCars.length });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// API to create booking
export const createBooking = async (req, res) => {
  try {
    const { _id } = req.user;
    const { car, pickupDate, returnDate } = req.body;

    const isAvailable = await checkAvailability(car, pickupDate, returnDate);
    if (!isAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Car is not available" });
    }

    const carData = await Car.findById(car);

    // calculate price based on pickupDate and returnDate
    const picked = new Date(pickupDate);
    const returned = new Date(returnDate);
    const noOfDays = Math.ceil((returned - picked) / (1000 * 60 * 60 * 24));
    const price = noOfDays * carData.pricePerDay;

    if (noOfDays <= 0) {
      return res.status(400).json({
        success: false,
        message: "Return date must be after pickup date",
      });
    }

    await Booking.create({
      car,
      owner: carData.owner,
      user: _id,
      pickupDate,
      returnDate,
      price,
    });

    res
      .status(201)
      .json({ success: true, message: "Booking created successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API TO LIST USER BOOKINGS
export const getUserBookings = async (req, res) => {
  try {
    const { _id } = req.user;
    const bookings = await Booking.find({ user: _id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.status(201).json({ success: true, bookings: bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API TO GET OWNER BOOKINGS
export const getOwnerBookings = async (req, res) => {
  try {
    if (req.user.role !== "owner") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    const bookings = await Booking.find({ owner: req.user._id })
      .populate("car user")
      .select("-user.password")
      .sort({ createdAt: -1 });

    res.status(201).json({ success: true, message: bookings });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// API to update booking status
export const changeBookingStatus = async (req, res) => {
  try {
    const { _id } = req.user;
    const { bookingId, status } = req.body;

    console.log("Received status:", status); // Add this to debug

    const booking = await Booking.findById(bookingId);

    if (booking.owner.toString() !== _id.toString()) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    booking.status = status;
    await booking.save();

    res
      .status(200)
      .json({ success: true, message: "Booking status updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
