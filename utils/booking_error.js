const { check, body, } = require("express-validator");


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
            return true; // Explicitly return true on successful validation
        }),

    check('time')
        .not()
        .isEmpty()
        .withMessage('Please Select Time'),

    check('address')
        .not()
        .isEmpty()
        .withMessage('Please your address'),


];

module.exports = bookingError