const express = require("express");

const router = express.Router();

const Event = require("../models/Event");

const {
    protect,
    admin
} = require("../middleware/auth");


// =====================================================
// GET ALL EVENTS
// =====================================================

router.get("/", async (req, res) => {

    try {

        const events =
            await Event.find()
                .sort({ date: 1 });

        res.json(events);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// =====================================================
// GET SINGLE EVENT
// =====================================================

router.get("/:id", async (req, res) => {

    try {

        const event =
            await Event.findById(
                req.params.id
            );

        if (!event) {

            return res.status(404).json({
                error: "Event not found"
            });

        }

        res.json(event);

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

});


// =====================================================
// CREATE EVENT - ADMIN ONLY
// =====================================================

router.post(
    "/",
    protect,
    admin,
    async (req, res) => {

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


            const event =
                await Event.create({

                    title,
                    description,
                    date,
                    location,
                    category,
                    totalSeats,
                    availableSeats,
                    ticketPrice,
                    imageUrl,

                    createdBy:
                        req.user._id

                });


            res.status(201).json(
                event
            );

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }
);


// =====================================================
// UPDATE EVENT - ADMIN ONLY
// =====================================================

router.put(
    "/:id",
    protect,
    admin,
    async (req, res) => {

        try {

            const event =
                await Event.findByIdAndUpdate(
                    req.params.id,
                    req.body,
                    {
                        new: true,
                        runValidators: true
                    }
                );


            if (!event) {

                return res.status(404).json({
                    error: "Event not found"
                });

            }


            res.json(event);

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }
);


// =====================================================
// DELETE EVENT - ADMIN ONLY
// =====================================================

router.delete(
    "/:id",
    protect,
    admin,
    async (req, res) => {

        try {

            const event =
                await Event.findByIdAndDelete(
                    req.params.id
                );


            if (!event) {

                return res.status(404).json({
                    error: "Event not found"
                });

            }


            res.json({
                message:
                    "Event deleted successfully"
            });

        } catch (error) {

            res.status(500).json({
                error: error.message
            });

        }

    }
);


module.exports = router;