const express =require("express");
const { verifyToken } = require("../middlerwares/auth");
const Payment = require("../Models/payment_model");
const payment_method_router=express.Router();



payment_method_router.get("/card", verifyToken, (req, res)=>{
    res.render('card.ejs')
})

payment_method_router.post("/create-payment", async (req,res)=>{

    try {
        const userId =req.cookies.userId
        console.log(userId)
        const {cardNumber, cvv, expiryDate } =  req.body;
        
        const makePayment ={
            UserId: userId,
            cardNumber,
            cvv,
            expiryDate
        }
        await Payment.create(makePayment)
        res.redirect("/games")
    } catch (error) {
        res.status(301).send("Something went wrong", error)
        
    }
})

module.exports = payment_method_router