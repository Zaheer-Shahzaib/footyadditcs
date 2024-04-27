var express = require("express");
const login_router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// var  sweetalert = require('sweetalert2');
const { check, body, validationResult } = require("express-validator");
const user_model = require("../Models/user_model.js");
const bodyParser = require("body-parser");


login_router.use(bodyParser.urlencoded({ extended: true }));

login_router.get("/login", async (req, res, next) => {
  res.render("login.ejs");
});

const validator = [
  body("email", "Email is not valid")
    .exists()
    .custom(async (value, { req }) => {
      let existingUser;
      existingUser = await user_model.findOne({
        where: { email: req.body.email },
      });
      if (!existingUser) {
        // Will use the below as the error message
        throw new Error("User does not exist! Please Signup");
      }
    }),
  body(
    "password",
    "Password must be eight characters, at least one uppercase letter, one lowercase letter, one number and one special character"
  )
    .exists()
    .isLength({ min: 8 })
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .custom(async (value, { req }) => {
      let existingUser;
      existingUser = await user_model.findOne({
        where: { email: req.body.email },
      });
      if (!existingUser) {
        // Will use the below as the error message
        throw new Error("User will not found! Please Signup");
      }
      const isPasswordCorrect = bcrypt.compareSync(
        value,
        existingUser.password
      );
      if (!isPasswordCorrect) {
        throw new Error("Please enter correct Password");
      }
    }),
];
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
        res.cookie("token", token, { httpOnly: true });
        // req.session.userId = existingUser.id;
        res.cookie("userId", existingUser.id);
        // console.log( res.cookie('userId', existingUser.id));
        // var lastVisit = cookies.get('LastVisit', { signed: true })
        res.redirect("/index");
      }
    } catch (error) {
      console.error("Error:", error);
      throw new Error("Something went wrong! Please try again later.");
    }
  }
  next();
});

module.exports = login_router;
