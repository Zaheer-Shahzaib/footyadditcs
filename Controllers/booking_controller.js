const booking_model = require("../Models/booking")
const express = require('express')
const { verifyToken } = require("../middlerwares/auth")
const booking_route = express.Router()
const bookingError = require('../utils/booking_error')
const { validationResult } = require('express-validator');
const User = require("../Models/user_model")


booking_route.get("/booking", verifyToken, (req, res) => {
    res.render("book_now.ejs")
})


booking_route.post("/booking", bookingError, async (req, res) => {
    // Validate request body
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('book_now.ejs', { alert: errors.array() });
    }

    try {
        // Extract booking data from request body
        const { sport, date, time, address, additionalNote } = req.body;

        // Create booking object
        const newBooking = {
            UserId: req.cookies.userId, // Assuming you have 'req.user.id' set
            sport,
            date,
            time,
            address,
            additionalNote,
        };

        // Create booking in database
        const createdBooking = await booking_model.create(newBooking);

        // Handle successful booking creation
        console.log("Booking created successfully:", createdBooking);
        res.redirect("/card"); // Assuming this redirects to the payment page
    } catch (error) {
        console.error("Error creating booking:", error);
        throw new Error("Something went wrong!")
    }
});

module.exports = booking_route