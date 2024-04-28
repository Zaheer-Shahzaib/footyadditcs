const { check, body } = require('express-validator');
const User = require('../Models/user_model');

const validation = [
    body('email', 'Email must be valid').isEmail()
        .exists()
        .custom(async value => {
            const existingUser = await User.findOne({ where: { email: value } });
            if (existingUser) {
                // Will use the below as the error message
                throw new Error('A user already exists with this email address');
            }
        }),
    check('password', 'Password must be eight characters, at least one uppercase letter, one lowercase letter, one number and one special character')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
    check('firstName')
        .not()
        .isEmpty()
        .withMessage('First Name is required!'),
    check('lastName')
        .not()
        .isEmpty()
        .withMessage('Last Name is required!'),
    check('phone')
        .not()
        .isEmpty()
        .withMessage('Phone Number is required!'),
    // Add other validation checks here (optional)

]


module.exports = validation