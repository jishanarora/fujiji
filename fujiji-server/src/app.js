// Express

const express = require('express');
// const { Sequelize } = require('sequelize');
// const { config} = require('./config/config');

const app = express();

// const appUrl = config.APP_URL;
const port = process.env.PORT || 3000;

// const sequelize = new Sequelize(db.NAME, db.USERNAME, db.PASSWORD, {
//   host: db.HOST,
//   dialect: 'mssql',
//   pool: {
//     max: 5,
//     min: 0,
//     idle: 10000,
//   },
// });

app.get('/', async (req, res) => {
  const response = {
    message: 'Hello from the server!!! I got updated and I think I should work fine now 2',
  };

  // const [allUser] = await sequelize.query('SELECT * FROM fujiji_user');
  // console.log(allUser);
  // const [allListing] = await sequelize.query('SELECT * FROM fujiji_listing');
  // console.log(allListing);
  // const [allToken] = await sequelize.query('SELECT * FROM fujiji_token');
  // console.log(allToken);

  return res.status(200).json(response);
});

app.listen(port, async () => {
  console.log(`Server is up on port :${port}`);
  console.log('test');

  // try {
  //   await sequelize.authenticate();
  //   console.log('Connection has beena established successfully.');
  // } catch (error) {
  //   console.error('Unable to connect to the database:', error);
  // }
});
