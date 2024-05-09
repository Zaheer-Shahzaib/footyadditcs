
const bcrypt = require('bcryptjs')
//const jwt = require('jsonwebtoken');
const user_model = require('../Models/user_model')
const express = require('express')
const signup_router = express.Router();
const bodyParser = require('body-parser')
const validation = require('../utils/signup_error');
const { check, validationResult, body } = require('express-validator');

signup_router.use(bodyParser.urlencoded({ extended: true }))
signup_router.use(bodyParser.json());

signup_router.get('/signup', function (req, res) {
    res.render('signup.ejs')

});

signup_router.post('/signup', validation , async (req, res, next) => {
    //destructing 
    const { firstName, lastName, password, phone, email } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('signup', {
            alert
        })
    }

    else {
        //validation for exiting user  
        let existingUser;
        console.log(existingUser);
        try {
            existingUser = await user_model.findOne({
                where: {
                    email: email
                }
            });
        } catch (error) {
            console.log(error);
        }
        // if (exitingUser) {
        //     const message="User Alread Exist with this mail" 
        //     return res.status(400).render('signup', message)
        // }
        const hashPassword = bcrypt.hashSync(password)
        //  const comparepassword = bcrypt.compare(hashPassword, password)
        const user = {
            phone,
            email,
            firstName,
            lastName,
            roles: 'User',
            password: hashPassword,

        }
        try {
            await user_model.create(user);
            console.log(user);
        }
        catch (err) {
            console.log(err);
        }
        res.redirect('/login');
    }
})

module.exports = signup_router