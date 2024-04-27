

const Sequelize=require('sequelize')
const sequelize = new Sequelize('Client', 'root', '', {
    host: 'localhost',
    port: 3306,
    dialect: 'mysql'
  });


try {
     sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  (async () => {
    try {
        // Sync the database
        await sequelize.sync({ alter: true });
        console.log('Database synchronized.');
    } catch (error) {
        console.error('Error synchronizing database:', error);
    } 
    // finally {
    //     // Close the Sequelize connection
    //     await sequelize.close();
    //     console.log('Connection closed.');
    // }
})();
module.exports= sequelize