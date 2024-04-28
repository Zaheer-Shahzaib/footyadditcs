var express = require("express");
const login_router = express.Router();
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// var  sweetalert = require('sweetalert2');
const { validationResult } = require("express-validator");
const user_model = require("../Models/user_model.js");
const bodyParser = require("body-parser");


login_router.use(bodyParser.urlencoded({ extended: true }));
const validator=require("../utils/login_error")
login_router.get("/login", async (req, res, next) => {
  res.render("login.ejs");
});



login_router.post("/login", validator, async (req, res, next) => {
  const { email, password } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const alert = errors.array();
    res.render("login", { alert });
  } else {
    try {
      const existingUser = await user_model.findOne({
        where: { email: email },
      });

      if (!existingUser) {
        // Handle the case where the user does not exist
        res.status(404).json({ message: "User not found" });
      } else {
        const token = jwt.sign(
          { id: existingUser.id },
          process.env.JWT_SCERET_KEY,
          {
            expiresIn: "12000sec",
          }
        );

        req.user = {
          id: existingUser.id,
          email: existingUser.email,
        };
        req.session.isLoggedIn = true;
        res.cookie("token", token, { httpOnly: true });
        // req.session.userId = existingUser.id;
        res.cookie("userId", existingUser.id);
        // console.log( res.cookie('userId', existingUser.id));
        // var lastVisit = cookies.get('LastVisit', { signed: true })
        res.redirect("/main_page");
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Something went wrong! Please try again later.");
    }
  }
  next();
});

module.exports = login_router;
