const express = require("express");
const Event = require("../models/Event");
const { protect } = require("../middleware/auth");

const router = express.Router();


// ==========================================
// GET ALL EVENTS
// ==========================================
router.get("/", async (req, res) => {
    try {
        const events = await Event.find()
            .populate("createdBy", "name email");

        res.status(200).json({
            events: events
        });

    } catch (error) {
        console.error("Get Events Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


// ==========================================
// GET SINGLE EVENT
// ==========================================
router.get("/:id", async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("createdBy", "name email");

        if (!event) {
            return res.status(404).json({
                error: "Event not found"
            });
        }

        res.status(200).json(event);

    } catch (error) {
        console.error("Get Event Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


// ==========================================
// CREATE EVENT
// ==========================================
router.post("/", protect, async (req, res) => {
    try {

        const {
            title,
            description,
            date,
            location,
            category,
            totalSeats,
            availableSeats,
            ticketPrice,
            imageUrl
        } = req.body;


        // Check required fields
        if (
            !title ||
            !description ||
            !date ||
            !location ||
            !category ||
            totalSeats === undefined ||
            availableSeats === undefined ||
            ticketPrice === undefined ||
            !imageUrl
        ) {
            return res.status(400).json({
                error: "Please provide all event details"
            });
        }


        // Create event
        const event = await Event.create({
            title: title,
            description: description,
            date: date,
            location: location,
            category: category,
            totalSeats: totalSeats,
            availableSeats: availableSeats,
            ticketPrice: ticketPrice,
            imageUrl: imageUrl,
            createdBy: req.user._id
        });


        res.status(201).json({
            message: "Event created successfully",
            event: event
        });

    } catch (error) {

        console.error("Create Event Error:", error);

        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;