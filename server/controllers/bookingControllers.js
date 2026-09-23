const Booking = require("../models/Booking");
const OTP = require("../models/OTP");
const Event = require("../models/Event");

const {
    sendOTPEmail,
    sendBookingEmail
} = require("../utils/email");


// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


// ==========================================
// SEND BOOKING OTP
// ==========================================
exports.sendBookingOTP = async (req, res) => {
    try {

        const otp = generateOTP();

        // Delete old booking OTP
        await OTP.findOneAndDelete({
            email: req.user.email,
            action: "event_booking"
        });

        // Create new OTP
        await OTP.create({
            email: req.user.email,
            otp: otp,
            action: "event_booking"
        });

        // Send OTP to email
        await sendOTPEmail(
            req.user.email,
            otp,
            "event_booking"
        );

        res.json({
            message: "OTP sent to email"
        });

    } catch (error) {

        console.error("Send Booking OTP Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// BOOK EVENT
// ==========================================
exports.bookEvent = async (req, res) => {
    try {

        const { eventId, otp } = req.body;


        // Check OTP
        const otpRecord = await OTP.findOne({
            email: req.user.email,
            otp: otp,
            action: "event_booking"
        });

        if (!otpRecord) {
            return res.status(400).json({
                error: "Invalid or expired OTP"
            });
        }


        // Find event
        const event = await Event.findById(eventId);

        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }


        // Check available seats
        if (event.availableSeats <= 0) {
            return res.status(400).json({
                error: "No seats available"
            });
        }


        // Check if user already booked this event
        const existingBooking = await Booking.findOne({
            userId: req.user._id,
            eventId: eventId
        });

        if (existingBooking) {
            return res.status(400).json({
                error: "You have already booked this event"
            });
        }


        // Create booking
        const booking = await Booking.create({
            userId: req.user._id,
            eventId: eventId,
            status: "pending",
            paymentStatus: "non_paid",
            amount: event.ticketPrice
        });


        // Delete used OTP
        await OTP.deleteMany({
            email: req.user.email,
            action: "event_booking"
        });


        // Send booking email
        await sendBookingEmail(
            req.user.email,
            event.title,
            booking._id
        );


        // Successful response
        res.status(201).json({
            message: "Booking created successfully",
            bookingId: booking._id,
            eventId: event._id,
            eventTitle: event.title,
            amount: event.ticketPrice,
            status: booking.status,
            paymentStatus: booking.paymentStatus
        });

    } catch (error) {

        console.error("Book Event Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
};


// ==========================================
// CONFIRM BOOKING
// ==========================================
exports.confirmBooking = async (req, res) => {
    try {

        const paymentStatus = req.body.paymentStatus;


        // Check payment status
        if (!["paid", "non_paid"].includes(paymentStatus)) {
            return res.status(400).json({
                error: "Invalid payment status"
            });
        }


        // Find booking
        const booking = await Booking.findById(req.params.id)
            .populate("eventId");

        if (!booking) {
            return res.status(404).json({
                error: "Booking not found"
            });
        }


        // Find event
        const event = booking.eventId;

        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }


        // Confirm booking
        booking.status = "confirmed";
        booking.paymentStatus = paymentStatus;

        await booking.save();


        // Reduce available seats
        if (event.availableSeats > 0) {
            event.availableSeats -= 1;
        }

        await event.save();


        // Send confirmation email
        await sendBookingEmail(
            req.user.email,
            event.title,
            booking._id
        );


        // Successful response
        res.json({
            message: "Booking confirmed successfully",
            bookingId: booking._id,
            eventId: event._id,
            eventTitle: event.title,
            status: booking.status,
            paymentStatus: booking.paymentStatus,
            remainingSeats: event.availableSeats
        });

    } catch (error) {

        console.error("Confirm Booking Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
};