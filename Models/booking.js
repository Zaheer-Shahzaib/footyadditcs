const sequelize = require('./index');
const { DataTypes, Model } = require('sequelize');
const crypto = require('crypto');
const User = require('./user_model');

// Define the User model

class Booking extends Model {
    static associations(model) {

    }

}

Booking.init({
    // Model attributes are defined here
    sport: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,


    },
    time: {
        type: DataTypes.TIME,
        allowNull: false,
    },

    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    additionalNote: {
        type: DataTypes.STRING,
        allowNull: false
    },

}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Booking' // We need to choose the model name
});


// the defined model is the class itself

module.exports = Booking