const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");

const {
    sendBookingOTP,
    bookEvent,
    confirmBooking
} = require("../controllers/bookingControllers");

const Booking = require("../models/Booking");


// ==========================================
// SEND BOOKING OTP
// ==========================================
router.post("/send-otp", protect, sendBookingOTP);


// ==========================================
// BOOK EVENT
// ==========================================
router.post("/book", protect, bookEvent);


// ==========================================
// CONFIRM BOOKING
// ==========================================
router.put("/confirm/:id", protect, confirmBooking);


// ==========================================
// GET MY BOOKINGS
// ==========================================
router.get("/my", protect, async (req, res) => {
    try {

        const bookings = await Booking.find({
            userId: req.user._id
        })
            .populate("eventId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            bookings: bookings
        });

    } catch (error) {

        console.error("Get My Bookings Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


// ==========================================
// GET SINGLE BOOKING
// ==========================================
router.get("/:id", protect, async (req, res) => {
    try {

        const booking = await Booking.findById(req.params.id)
            .populate("eventId")
            .populate("userId", "name email");

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }

        // Only allow the booking owner to view it
        if (
            booking.userId._id.toString() !==
            req.user._id.toString()
        ) {
            return res.status(403).json({
                error: "You are not allowed to view this booking"
            });
        }

        res.status(200).json({
            booking: booking
        });

    } catch (error) {

        console.error("Get Booking Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;