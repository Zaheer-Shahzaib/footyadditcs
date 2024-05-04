const express = require("express")
const { verifyToken } = require("../middlerwares/auth")
const Booking = require("../Models/booking")
const { validationResult, check, body } = require("express-validator")
const gamesRouter = express.Router()


const validation = [

    body('newDate')
        .notEmpty()
        .withMessage('Date is required')
        .custom((value, { req }) => {
            const bookingDate = new Date(value);
            const today = new Date();
            if (bookingDate < today) {
                throw new Error('Booking date cannot be in the past.');
            }
            return true
        }),
];

gamesRouter.get("/reschedule/:id", validation, verifyToken, async (req, res) => {
    const id =req.params.id
    res.render("reschedule.ejs", {id:id});
  });

gamesRouter.get("/games", verifyToken, async (req, res) => {
    try {
        const UserId = req.cookies.userId
        console.log(UserId)
        const gamesList = await Booking.findAll({ where: { UserId: UserId, sport: 'football' } })

        // console.log("All games",  gamesList)
        res.render("games.ejs", { data: gamesList })
    } catch (error) {
        console.log("error")
    }
});

gamesRouter.post('/deleteGame/:id', async (req, res) => {
    try {
        // Extract game ID from request parameters
        const gameId = req.params.id;

        if (!gameId) {
            // Handle missing game ID: return error
            return res.status(400).json({ error: 'Missing game ID in request parameters.' });
        }

        // Delete the game (assuming gameId is the primary key)
        const deletedGame = await Booking.destroy({
            where: {
                id: gameId // Replace 'id' with your actual primary key field name
            }
        });

        // Check if deletion was successful (affected rows should be 1)
        if (deletedGame === 1) {
            res.redirect("/games");
        }
    } catch (error) {
        console.error("Error deleting game:", error);
        res.status(500).json({ error: 'An error occurred while deleting the game.' });
    }
});

gamesRouter.post('/reschedule/:id', async (req, res) => {
    const gameId = req.params.id;
    console.log("post schedule", gameId);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).render('reschedule.ejs', { alert: errors.array() });
    }
    
    try {
        // Extract game ID from request parameters
        
        
        // Extract reschedule details from request body
        const { newDate, newTime } = req.body;
        console.log("body request", newDate, newTime)
        // Update the booking using Sequelize
        const updatedCount = await Booking.findOne({where:{id: gameId}});
        console.log("update successful", updatedCount);
        
       const updatedSchedule = {
        date:newDate,
        time: newTime
       }
       await updatedCount.update(updatedSchedule)
        // Check if update was successful (affected rows should be 1)
        if (updatedCount) {
            res.redirect("/games")
        } 
    } catch (error) {
        console.error("Error rescheduling game:", error);
        res.status(500).json({ error: 'An error occurred while rescheduling the game.' });
    }
});
module.exports = gamesRouter