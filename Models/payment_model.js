const sequelize = require('./index');
const { DataTypes, Model } = require('sequelize');
const User = require('./user_model');


// Define the User model

class Payment extends Model {
    static associations(model) {

    }

}

Payment.init({
    // Model attributes are defined here
    cardNumber: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expiryDate: {
        type: DataTypes.STRING,
        allowNull: false,


    },
    cvv: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'Payment' // We need to choose the model name
});


Payment.belongsTo(User, {
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT'
})

module.exports = Payment