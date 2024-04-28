const { check, body, } = require("express-validator");
const User = require("../Models/user_model");
const bcrypt = require("bcryptjs");

const validator = [
    body("email", "Email is not valid").isEmail()
        .exists()
        .custom(async (value, { req }) => {
            let existingUser;
            existingUser = await User.findOne({
                where: { email: req.body.email },
            });
            if (!existingUser) {
                // Will use the below as the error message
                throw new Error("User does not exist! Please Signup");
            }
        }),
    body("password")

        .custom(async (value, { req }) => {
            let existingUser;
            existingUser = await User.findOne({
                where: { email: req.body.email },
            });
            const isPasswordCorrect = bcrypt.compareSync(
                value,
                existingUser.password
            );
            if (!isPasswordCorrect) {
                throw new Error("Please enter correct Password");
            }
        }),
];

module.exports = validator