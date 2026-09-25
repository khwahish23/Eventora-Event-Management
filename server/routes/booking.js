const express = require("express");

const router = express.Router();

const {
    protect
} = require("../middleware/auth");

const {
    sendBookingOTP,
    bookEvent,
    confirmBooking
} = require("../controllers/bookingControllers");

const Booking = require("../models/Booking");


// =====================================================
// SEND BOOKING OTP
// =====================================================

router.post(
    "/send-otp",
    protect,
    sendBookingOTP
);


// =====================================================
// CREATE BOOKING
// =====================================================

router.post(
    "/book",
    protect,
    bookEvent
);


// =====================================================
// CONFIRM BOOKING
// =====================================================

router.put(
    "/confirm/:id",
    protect,
    confirmBooking
);


// =====================================================
// MY BOOKINGS
// =====================================================

router.get(
    "/my",
    protect,
    async (req, res) => {

        try {

            const bookings =
                await Booking.find({
                    userId: req.user._id
                })
                    .populate("eventId")
                    .sort({
                        createdAt: -1
                    });


            res.json(bookings);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }
);


// =====================================================
// SINGLE BOOKING
// =====================================================

router.get(
    "/:id",
    protect,
    async (req, res) => {

        try {

            const booking =
                await Booking.findById(
                    req.params.id
                )
                    .populate("eventId");


            if (!booking) {

                return res.status(404).json({
                    error:
                        "Booking not found"
                });

            }


            if (
                booking.userId.toString() !==
                req.user._id.toString()
            ) {

                return res.status(403).json({
                    error:
                        "Not allowed"
                });

            }


            res.json(booking);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }
);


module.exports = router;