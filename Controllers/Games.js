const express = require("express")
const { verifyToken } = require("../middlerwares/auth")
const Booking = require("../Models/booking")
const gamesRouter = express.Router()



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
})


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



module.exports = gamesRouter