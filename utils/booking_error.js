const { check, body, } = require("express-validator");
const Booking = require("../Models/booking");


const bookingError = [
    check('sport')
        .not()
        .isEmpty()
        .withMessage('Please Select atleast one Sport'),
    body('date')
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
    check('time')
        .not()
        .isEmpty()
        .withMessage('Please Select Time').custom((value, { req }) => {
            const existingTime = Booking.findOne({ where: { time: value } })
            const bodytime = req.body.time

            if (existingTime == bodytime) {
                throw new Error("Already Booking...!")
            }
            return true
        }),

    check('address')
        .not()
        .isEmpty()
        .withMessage('Please enter your address'),


];

module.exports = bookingError