const express =require('express');
const Booking = require('../Models/booking');
const { verifyToken, restricted } = require('../middlerwares/auth');
const adminRouter= express.Router();

adminRouter.get("/upcoming-bookings",  verifyToken,  async (req, res) => {
    try {
        const UserId = req.cookies.userId
        console.log(UserId)
        const gamesList = await Booking.findAll({ where: { UserId: UserId, sport: 'football' } })

        // console.log("All games",  gamesList)
        res.render("upcomingBooking.ejs");

    } catch (error) {
        console.log("error")
    }
});

module.exports = adminRouter